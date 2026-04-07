/**
 * VetCare Plus - Common JavaScript Functions
 * Beautiful modals to replace alert() and confirm()
 */

// Beautiful Alert Modal (replaces alert())
function showAlert(message, title = 'Information', type = 'info') {
    // Remove existing alert modal if any
    const existingModal = document.getElementById('customAlertModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const icon = icons[type] || icons.info;

    // Create modal HTML
    const modalHTML = `
        <div id="customAlertModal" class="alert-modal" style="display: flex;">
            <div class="alert-modal-content">
                <div class="alert-modal-header">
                    <span class="alert-modal-icon">${icon}</span>
                    <h3 class="alert-modal-title">${title}</h3>
                </div>
                <div class="alert-modal-body">
                    ${message}
                </div>
                <div class="alert-modal-footer">
                    <button onclick="closeAlertModal()" class="btn btn-primary">OK</button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close on background click
    document.getElementById('customAlertModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAlertModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeAlertModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function closeAlertModal() {
    const modal = document.getElementById('customAlertModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Beautiful Confirm Modal (replaces confirm())
function showConfirm(message, title = 'Confirm', onConfirm, onCancel) {
    // Remove existing confirm modal if any
    const existingModal = document.getElementById('customConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal HTML
    const modalHTML = `
        <div id="customConfirmModal" class="confirm-modal" style="display: flex;">
            <div class="confirm-modal-content">
                <div class="alert-modal-header">
                    <span class="alert-modal-icon">❓</span>
                    <h3 class="alert-modal-title">${title}</h3>
                </div>
                <div class="alert-modal-body">
                    ${message}
                </div>
                <div class="alert-modal-footer">
                    <button onclick="closeConfirmModal(false)" class="btn btn-secondary">Cancel</button>
                    <button onclick="closeConfirmModal(true)" class="btn btn-primary">Confirm</button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Store callbacks
    window._confirmCallbacks = { onConfirm, onCancel };

    // Close on background click (as cancel)
    document.getElementById('customConfirmModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeConfirmModal(false);
        }
    });

    // Close on Escape key (as cancel)
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeConfirmModal(false);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function closeConfirmModal(confirmed) {
    const modal = document.getElementById('customConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }

    // Execute callbacks
    if (window._confirmCallbacks) {
        if (confirmed && window._confirmCallbacks.onConfirm) {
            window._confirmCallbacks.onConfirm();
        } else if (!confirmed && window._confirmCallbacks.onCancel) {
            window._confirmCallbacks.onCancel();
        }
        delete window._confirmCallbacks;
    }
}

// Navigation helper function
function navigateTo(page) {
    window.location.href = page;
}

// Logout function (common across all pages)
async function handleLogout() {
    showConfirm(
        'Are you sure you want to logout?',
        'Confirm Logout',
        async function() {
            try {
                await callAPI('logout');
                sessionStorage.clear();
                window.location.href = 'Login.html';
            } catch (error) {
                console.error('Logout error:', error);
                sessionStorage.clear();
                window.location.href = 'Login.html';
            }
        }
    );
}

// Show success message
function showSuccess(message) {
    const el = document.getElementById('successMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 5000);
    }
}

// Show error message
function showError(message) {
    const el = document.getElementById('errorMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 5000);
    }
}

// Check authentication on page load
function checkAuthentication() {
    if (!sessionStorage.getItem('authenticated')) {
        window.location.href = 'Login.html';
    }
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN');
}

// Format datetime
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-IN');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading state to button
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}

// Initialize tooltips (if needed)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarToggle = document.querySelector('.navbar-toggle');
    
    if (navbarMenu && navbarToggle) {
        navbarMenu.classList.toggle('active');
        navbarToggle.classList.toggle('active');
    }
}

// Close mobile menu when clicking on a nav link
function closeMobileMenuOnClick() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarMenu = document.querySelector('.navbar-menu');
            const navbarToggle = document.querySelector('.navbar-toggle');
            
            if (navbarMenu && navbarToggle) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    });
}

// Initialize mobile menu on page load
document.addEventListener('DOMContentLoaded', function() {
    closeMobileMenuOnClick();
});

// Pagination Helper Class
class Paginator {
    constructor(items, itemsPerPage = 10) {
        this.allItems = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }

    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.allItems.slice(start, end);
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }

    prevPage() {
        return this.goToPage(this.currentPage - 1);
    }

    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.totalPages = Math.ceil(this.allItems.length / count);
        this.currentPage = 1;
    }

    updateItems(items) {
        this.allItems = items;
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        this.currentPage = 1;
    }

    getInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(start + this.itemsPerPage - 1, this.allItems.length);
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalItems: this.allItems.length,
            start: start,
            end: end,
            hasNext: this.currentPage < this.totalPages,
            hasPrev: this.currentPage > 1
        };
    }
}

// Create pagination controls HTML
function createPaginationControls(paginator, onPageChange) {
    const info = paginator.getInfo();
    
    return `
        <div class="pagination">
            <div class="pagination-info">
                Showing ${info.start}-${info.end} of ${info.totalItems} records
            </div>
            <button class="pagination-btn"
                    onclick="${onPageChange}('first')"
                    ${!info.hasPrev ? 'disabled' : ''}>
                ⏮️ First
            </button>
            <button class="pagination-btn"
                    onclick="${onPageChange}('prev')"
                    ${!info.hasPrev ? 'disabled' : ''}>
                ◀️ Prev
            </button>
            <span style="padding: 0 0.5rem; font-size: 0.875rem;">
                Page ${info.currentPage} of ${info.totalPages}
            </span>
            <button class="pagination-btn"
                    onclick="${onPageChange}('next')"
                    ${!info.hasNext ? 'disabled' : ''}>
                Next ▶️
            </button>
            <button class="pagination-btn"
                    onclick="${onPageChange}('last')"
                    ${!info.hasNext ? 'disabled' : ''}>
                Last ⏭️
            </button>
            <div class="page-size-selector">
                <label for="pageSize">Per page:</label>
                <select id="pageSize" onchange="${onPageChange}('size', this.value)">
                    <option value="10" ${info.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="20" ${info.itemsPerPage === 20 ? 'selected' : ''}>20</option>
                    <option value="50" ${info.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                    <option value="100" ${info.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                </select>
            </div>
        </div>
    `;
}

// Export functions for use in other scripts
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.closeAlertModal = closeAlertModal;
window.closeConfirmModal = closeConfirmModal;
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.showSuccess = showSuccess;
window.showError = showError;
window.checkAuthentication = checkAuthentication;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.debounce = debounce;
window.setButtonLoading = setButtonLoading;
window.validateForm = validateForm;
window.initTooltips = initTooltips;
window.toggleMobileMenu = toggleMobileMenu;
window.Paginator = Paginator;
window.createPaginationControls = createPaginationControls;