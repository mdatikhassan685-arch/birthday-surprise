// WebSocket Configuration
const SOCKET_CONFIG = {
  TIMEOUT: 20000,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  PAYMENT_TIMEOUT: 300000
};

/**
 * Socket Manager Class - Quản lý WebSocket connection
 */
class SocketManager {
  constructor() {
    this.socket = null;
    this.currentOrder = null;
    this.eventHandlers = new Map();
    this.isConnected = false;
  }

  /**
   * Khởi tạo WebSocket connection
   */
  init() {
    try {
      this.socket = io(`https://dearlove-backend.onrender.com`, {
        transports: ['websocket', 'polling'],
        timeout: SOCKET_CONFIG.TIMEOUT,
        reconnection: true,
        reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
        reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS
      });

      this._setupEventListeners();
      return this.socket;
    } catch (error) {
      console.error('Lỗi khởi tạo WebSocket:', error);
      return null;
    }
  }

  /**
   * Thiết lập event listeners
   */
  _setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this._handleReconnection();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
      this.isConnected = false;
    });
  }

  /**
   * Xử lý kết nối lại khi reconnect
   */
  _handleReconnection() {
    const currentOrderCode = localStorage.getItem('current_order_code');
    const isPaymentInProgress = localStorage.getItem('payment_in_progress') === 'true';
    
    if (currentOrderCode && isPaymentInProgress) {
      this.joinOrder(currentOrderCode);
    }
  }

  /**
   * Join vào room theo dõi order
   */
  joinOrder(orderCode) {
    if (!this.socket || !this.isConnected) {
      console.error('❌ Socket chưa kết nối');
      return false;
    }

    // Leave room cũ nếu có
    if (this.currentOrder && this.currentOrder !== orderCode) {
      this.leaveOrder(this.currentOrder);
    }

    this.socket.emit('join-order', orderCode);
    this.currentOrder = orderCode;
    return true;
  }

  /**
   * Leave khỏi room
   */
  leaveOrder(orderCode) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('leave-order', orderCode);
    if (this.currentOrder === orderCode) {
      this.currentOrder = null;
    }
  }

  /**
   * Đăng ký event handler với cleanup
   */
  on(event, handler) {
    if (!this.socket) return;

    // Lưu handler để có thể remove sau
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);

    this.socket.on(event, handler);
  }

  /**
   * Remove event handler
   */
  off(event, handler) {
    if (!this.socket) return;

    this.socket.off(event, handler);
    
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Cleanup tất cả event handlers
   */
  cleanup() {
    if (!this.socket) return;

    // Remove tất cả event handlers
    for (const [event, handlers] of this.eventHandlers) {
      handlers.forEach(handler => {
        this.socket.off(event, handler);
      });
    }
    this.eventHandlers.clear();

    // Leave current order
    if (this.currentOrder) {
      this.leaveOrder(this.currentOrder);
    }

    this.socket.disconnect();
    this.socket = null;
    this.currentOrder = null;
    this.isConnected = false;
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}

// Tạo instance global
const socketManager = new SocketManager();

/**
 * Khởi tạo WebSocket connection
 */
function initWebSocket() {
  const socket = socketManager.init();
  
  // Lưu reference cho backward compatibility
  window.socket = socketManager.socket;
  
  return socket;
}

/**
 * Cleanup payment state
 */
function cleanupPaymentState(orderCode, showError = false) {
  localStorage.removeItem('payment_in_progress');
  localStorage.removeItem('current_order_code');
  
  if (socketManager.currentOrder === orderCode) {
    socketManager.leaveOrder(orderCode);
  }
}

// Khai báo global types để tránh TypeScript errors
if (typeof window !== 'undefined') {
  window.socketManager = socketManager;
  window.initWebSocket = initWebSocket;
  window.cleanupPaymentState = cleanupPaymentState;
}

class PricingCalculator {
    constructor() {
        this.basePrices = {
            defaultMusic: 0,        // Nhạc nền mặc định miễn phí
            customMusic: 5000,      // Nhạc nền tùy chỉnh +5k
            bookEnabled: 20000,     // Sách được bật +20k
            extraPage: 3000,        // Mỗi trang thêm (>10 trang) +3k
            heartEffect: 5000,      // Hiệu ứng trái tim +5k
            saveForever: 20000      // Lưu QR vĩnh viễn +20k
        };

        this.defaultSettings = {
            music: './music/happy-birthday.mp3',
            enableBook: false,
            enableHeart: false,
            isSave: false,
            pages: []
        };
        this.selectedVoucher = null;
        this.vouchers = [];
        this.createPricingUI();
        this.initializeVoucherSystem(); // ✅ Thêm dòng này
        this.updatePricing();
    }

    createPricingUI() {
        // Tạo container cho pricing
        const pricingContainer = document.createElement('div');
        pricingContainer.id = 'pricingContainer';
        pricingContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg,rgb(8, 26, 28),rgb(26, 73, 74));
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(61, 193, 213, 0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        `;

        pricingContainer.innerHTML = `
    <div class = "pricing-header" style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 18px; margin-right: 8px;">💰</span>
        <strong style="font-size: 16px;">${t('pricingTitle')}</strong>
    </div>
    <div id="pricingDetails"></div>
    <!-- Voucher Section -->
    <div id="voucherSection" style="
        border-top: 1px solid rgba(255,255,255,0.3);
        margin-top: 10px;
        padding-top: 10px;
        display: none;
    ">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; margin-right: 8px;">🎫</span>
            <strong style="font-size: 14px;">${t('voucher')}</strong>
        </div>
        <div id="voucherList" style="
            max-height: 120px;
            overflow-y: auto;
            margin-bottom: 8px;
            font-size: 12px;
        "></div>
        <div id="voucherResult" style="
            padding: 6px 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            font-size: 12px;
            color: #4caf50;
            display: none;
        "></div>
    </div>
    <div style="margin: 10px 0;" class = "pricing-tip">
        <label for="tipAmount" style="font-size: 14px; color: #fff;">${t('tip')}</label>
        <input id="tipAmount" type="number" min="0" value="0" style="
            width: 80px;
            margin-left: 10px;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 14px;
        ">
    </div>
    <!-- Payment Method Section -->
    <div id="paymentMethodSection" style="
        border-top: 1px solid rgba(255,255,255,0.3);
        margin-top: 10px;
        padding-top: 10px;
        display: none;
    ">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; margin-right: 8px;">💳</span>
            <strong style="font-size: 14px;">${t('paymentMethod')}</strong>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <!-- PayOS Option -->
            <div class="payment-method-container" data-method="PAYOS" style="
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                padding: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.05);
            ">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 13px; margin: 0;">
                    <input type="radio" name="paymentMethod" value="PAYOS" checked style="
                        margin-right: 10px;
                        transform: scale(1.2);
                    ">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 2px;">
                            <span style="margin-right: 8px; font-size: 16px;">🏦</span>
                            <strong style="font-size: 13px;">${t('bankPayment')}</strong>
                        </div>
                        <div style="
                            font-size: 11px;
                            color: rgba(255,255,255,0.7);
                            font-style: italic;
                        ">${t('bankPaymentDesc')}</div>
                    </div>
                </label>
            </div>
            
            <!-- PayPal Option -->
            <div class="payment-method-container" data-method="PAYPAL" style="
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                padding: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.05);
            ">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 13px; margin: 0;">
                    <input type="radio" name="paymentMethod" value="PAYPAL" style="
                        margin-right: 10px;
                        transform: scale(1.2);
                    ">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 2px;">
                            <img src="image/paypal.jpg" style="margin-right: 8px; width: 16px; height: 16px; object-fit: contain;">
                            <strong style="font-size: 13px;">${t('paypalPayment')}</strong>
                        </div>
                        <div style="
                            font-size: 11px;
                            color: rgba(255,255,255,0.7);
                            font-style: italic;
                        ">${t('paypalPaymentDesc')}</div>
                    </div>
                </label>
            </div>
        </div>
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.3); margin-top: 10px; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <strong style="font-size: 16px;">${t('total')}</strong>
            <strong id="totalPrice" style="font-size: 18px; color: #ffeb3b;">0đ</strong>
        </div>
        <button id="actionButton" style="
            width: 100%;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        ">${t('createWebsite')}</button>
    </div>
    <button id="togglePricing" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: red;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        opacity: 0.7;
    ">−</button>
`;

        document.body.appendChild(pricingContainer);

        // Toggle functionality
        const toggleBtn = document.getElementById('togglePricing');
        const pricingDetails = document.getElementById('pricingDetails');
        const voucherSection = document.getElementById('voucherSection');
        const paymentMethodSection = document.getElementById('paymentMethodSection');
        let isCollapsed = false;

        const tipInput = document.getElementById('tipAmount');
        if (tipInput) {
            tipInput.addEventListener('input', () => {
                // Lưu tip vào settings (global hoặc window.settings)
                if (!window.settings) window.settings = {};
                window.settings.tip = parseInt(tipInput.value) || 0;
                this.updatePricing();
            });
        }

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                pricingDetails.style.display = 'none';
                voucherSection.style.display = 'none';
                paymentMethodSection.style.display = 'none';
                pricingContainer.style.padding = '10px 20px';
                toggleBtn.textContent = '+';
            } else {
                pricingDetails.style.display = 'block';
                // Chỉ hiển thị voucher section nếu người dùng đã đăng nhập
                if (localStorage.getItem('user_uid')) {
                    voucherSection.style.display = 'block';
                }
                // Hiển thị payment method section nếu có giá tiền
                if (this.currentTotal > 0) {
                    paymentMethodSection.style.display = 'block';
                }
                pricingContainer.style.padding = '15px 20px';
                toggleBtn.textContent = '−';
            }
        });

        // Action button functionality
        const actionButton = document.getElementById('actionButton');
        actionButton.addEventListener('click', () => {
            this.handleActionButton();
        });

        // Payment method selection functionality
        setTimeout(() => {
            this.setupPaymentMethodSelection();
        }, 100);

        // Responsive design
        const mediaQuery = window.matchMedia("(max-height: 500px) and (orientation: landscape)");
        const adjustForLandscape = (e) => {
            if (e.matches) {
                pricingContainer.style.cssText += `
                    bottom: 10px;
                    left: 10px;
                    padding: 8px 12px;
                    font-size: 12px;
                    max-width: 200px;
                `;
            } else {
                pricingContainer.style.cssText = pricingContainer.style.cssText.replace(
                    /bottom: 10px;|left: 10px;|padding: 8px 12px;|font-size: 12px;|max-width: 200px;/g,
                    ''
                );
            }
        };

        mediaQuery.addListener(adjustForLandscape);
        adjustForLandscape(mediaQuery);
    }

    // ✅ Initialize voucher system
    initializeVoucherSystem() {

        // Kiểm tra đăng nhập khi khởi tạo
        const savedUID = localStorage.getItem('user_uid');
        if (savedUID) {
            const voucherSection = document.getElementById('voucherSection');
            if (voucherSection) {
                voucherSection.style.display = 'block';
            }
            this.loadUserVouchers();
        } else {
        }

        // Listen for voucher changes
        const voucherList = document.getElementById('voucherList');
        if (voucherList) {
            voucherList.addEventListener('change', (e) => {
                if (e.target.name === 'voucher') {
                    this.handleVoucherChange(e);
                }
            });
        }
    }

    // Setup payment method selection with hover effects
    setupPaymentMethodSelection() {
        const paymentMethodContainers = document.querySelectorAll('.payment-method-container');
        const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        let updateTimeout = null;

        // Function to update visual state of all containers
        const updateVisualState = () => {
            paymentMethodContainers.forEach((container, index) => {
                const radio = paymentMethodRadios[index];
                if (radio.checked) {
                    container.style.border = '2px solid #4caf50';
                    container.style.background = 'rgba(76, 175, 80, 0.1)';
                    container.style.transform = 'translateY(0)';
                } else {
                    container.style.border = '2px solid rgba(255,255,255,0.3)';
                    container.style.background = 'rgba(255,255,255,0.05)';
                    container.style.transform = 'translateY(0)';
                }
            });
        };

        // Function to update pricing with debouncing
        const updatePricingWithDebounce = () => {
            // Clear existing timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            
            // Set new timeout to update pricing after 100ms delay
            updateTimeout = setTimeout(() => {
                this.updatePricing();
            }, 100);
        };

        // Add click event listeners to containers
        paymentMethodContainers.forEach((container, index) => {
            const radio = paymentMethodRadios[index];
            
            // Click handler for container
            container.addEventListener('click', (e) => {
                // Prevent double-triggering if clicking on radio or label
                if (e.target.type === 'radio' || e.target.tagName === 'LABEL') {
                    return;
                }
                
                // Set the radio as checked
                radio.checked = true;
                
                // Update visual state and pricing
                updateVisualState();
                updatePricingWithDebounce();
            });

            // Hover effects
            container.addEventListener('mouseenter', () => {
                if (!radio.checked) {
                    container.style.border = '2px solid rgba(255,255,255,0.5)';
                    container.style.background = 'rgba(255,255,255,0.1)';
                    container.style.transform = 'translateY(-1px)';
                }
            });

            container.addEventListener('mouseleave', () => {
                if (!radio.checked) {
                    container.style.border = '2px solid rgba(255,255,255,0.3)';
                    container.style.background = 'rgba(255,255,255,0.05)';
                    container.style.transform = 'translateY(0)';
                }
            });

            // Radio change event
            radio.addEventListener('change', () => {
                updateVisualState();
                updatePricingWithDebounce();
            });
        });

        // Set initial state
        updateVisualState();
    }

    // Load user vouchers
    async loadUserVouchers() {

        const voucherList = document.getElementById('voucherList');
        const voucherResult = document.getElementById('voucherResult');

        if (!voucherList) {
            console.error('🎫 [VOUCHER LOAD] voucherList element not found');
            return;
        }

        voucherList.innerHTML = 'Đang tải voucher...';
        if (voucherResult) voucherResult.style.display = 'none';
        this.selectedVoucher = null;
        this.vouchers = [];

        const uid = localStorage.getItem('user_uid');
        if
