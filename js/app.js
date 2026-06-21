// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Views HTML Content
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = `
        <!-- Landing View -->
        <div id="view-landing" class="view view-container landing-view">
            <h1 class="hero-title animate-slide-up stagger-1">
                <span class="text-gradient">ACCENTURE FORWARD DEPLOYED ENGINEERING</span><br>
                Mission-Grade AI Deployment & GRC
            </h1>
            <p class="hero-subtitle animate-slide-up stagger-2">
                An enterprise-scale digital infrastructure converging AI deployment, federal compliance, and unified risk management for rapid operationalization.
            </p>
            <div class="hero-stats animate-slide-up stagger-3">
                <div class="hero-stat-item">
                    <span class="hero-stat-value" id="stat-agencies">0</span>
                    <span class="hero-stat-label">Agencies Monitored</span>
                </div>
                <div class="hero-stat-item">
                    <span class="hero-stat-value" id="stat-controls">0</span>
                    <span class="hero-stat-label">Controls Assessed</span>
                </div>
                <div class="hero-stat-item">
                    <span class="hero-stat-value" id="stat-threats">0</span>
                    <span class="hero-stat-label">Threats Mitigated</span>
                </div>
            </div>
            <div class="animate-slide-up stagger-4">
                <a href="#/dashboard" class="btn btn-primary btn-lg">
                    Enter the Platform 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </div>

        <!-- Dashboard View -->
        <div id="view-dashboard" class="view view-container">
            <div class="page-header">
                <div>
                    <h2 class="page-title">Federal Command Center</h2>
                    <p>Real-time overview of compliance posture and active threats.</p>
                </div>
                <div class="toolbar">
                    <span class="status-badge status-info"><div class="live-indicator" style="margin-right: 8px;"></div> LIVE SYNC</span>
                    <button class="btn btn-secondary">Export Report</button>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <!-- KPIs -->
                <div class="kpi-row">
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Overall Compliance</span>
                            <svg class="kpi-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div class="kpi-value text-gradient">84.2%</div>
                        <div class="kpi-trend positive"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> +2.4% this month</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Active Risks (High/Crit)</span>
                            <svg class="kpi-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <div class="kpi-value" style="color: var(--color-status-critical)">12</div>
                        <div class="kpi-trend negative"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> +3 since last week</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Open POA&Ms</span>
                            <svg class="kpi-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <div class="kpi-value">47</div>
                        <div class="kpi-trend positive"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> -12 resolved</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Incident MTTR</span>
                            <svg class="kpi-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div class="kpi-value">4.2h</div>
                        <div class="kpi-trend positive">Better than SLA (8h)</div>
                    </div>
                </div>

                <!-- Main Radar / Chart Area -->
                <div class="card radar-section">
                    <h3 class="card-title">Compliance Posture Radar</h3>
                    <div class="radar-container" id="dashboard-radar-chart">
                        <!-- Canvas will be injected by charts.js -->
                    </div>
                </div>

                <!-- Active Alerts Sidebar -->
                <div class="card alerts-section">
                    <div class="card-header">
                        <h3 class="card-title">Live Alerts</h3>
                        <button class="btn btn-ghost" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">View All</button>
                    </div>
                    <div class="alert-list" id="dashboard-alerts">
                        <!-- Populated by data.js -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Framework View -->
        <div id="view-framework" class="view view-container">
            <div class="page-header">
                <div>
                    <h2 class="page-title">NIST CSF Explorer</h2>
                    <p>Navigate and assess controls across the framework core.</p>
                </div>
            </div>
            <div class="framework-layout">
                <div class="card function-list" id="framework-functions">
                    <!-- Populated by JS -->
                </div>
                <div class="card controls-detail" id="framework-controls">
                    <h3 style="color: var(--color-text-secondary); text-align: center; margin-top: 2rem;">Select a function to view controls</h3>
                </div>
            </div>
        </div>

        <!-- Risks View -->
        <div id="view-risks" class="view view-container">
            <div class="page-header">
                <div>
                    <h2 class="page-title">Risk Register</h2>
                    <p>Manage and track identified enterprise risks.</p>
                </div>
                <div class="toolbar">
                    <input type="text" class="search-input" placeholder="Search risks...">
                    <button class="btn btn-primary">+ Log New Risk</button>
                </div>
            </div>
            <div class="card">
                <div class="table-container">
                    <table id="risks-table">
                        <thead>
                            <tr>
                                <th>Risk ID</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Placeholder views for the rest -->
        <div id="view-assessments" class="view view-container">
            <h2 class="page-title">Compliance Assessments</h2>
            <div class="card" style="margin-top: 2rem; text-align: center; padding: 4rem;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple-primary)" stroke-width="1.5" style="margin-bottom: 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <h3>Assessment Engine Initialization</h3>
                <p>Select a framework to begin a new simulated assessment.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;">Start Assessment Workflow</button>
            </div>
        </div>

        <div id="view-supply-chain" class="view view-container">
            <div class="page-header">
                <div>
                    <h2 class="page-title">Supply Chain Risk Modeling</h2>
                    <p>Predictive analytics for third-party and vendor ecosystem risks.</p>
                </div>
                <div class="toolbar">
                    <button class="btn btn-secondary">Run Deep Scan</button>
                    <button class="btn btn-primary">+ Onboard Vendor</button>
                </div>
            </div>
            <div class="card">
                <div class="table-container">
                    <table id="supply-chain-table">
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Tier</th>
                                <th>Risk Score</th>
                                <th>Vulnerabilities</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="view-incidents" class="view view-container">
            <h2 class="page-title">Incident Response Center</h2>
            <p>SOC Simulation and Incident Tracking</p>
        </div>

        <div id="view-reports" class="view view-container">
            <h2 class="page-title">Reports & Analytics</h2>
            <p>Generate FISMA and BOD compliance reports.</p>
        </div>

        <div id="view-ai" class="view view-container">
            <div class="page-header">
                <div>
                    <h2 class="page-title">Genesis AI Insights</h2>
                    <p>Natural language querying and predictive GRC analysis.</p>
                </div>
            </div>
            <div class="ai-layout">
                <div class="card chat-container">
                    <div class="chat-history">
                        <div class="chat-msg msg-ai">
                            <strong>System:</strong> Welcome to Accenture Federal Services AI. I am analyzing the current federal compliance posture. I notice a cluster of vulnerabilities related to Identity & Access Management (PR.AC). How can I assist you today?
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="ai-chat-input" class="chat-input" placeholder="Ask a question about your compliance posture...">
                        <button id="ai-chat-btn" class="btn btn-primary">Send</button>
                    </div>
                </div>
                <div class="suggestions-panel">
                    <h4 style="margin-bottom: 0.5rem;">Suggested Queries</h4>
                    <div class="suggestion-card">
                        "Summarize critical risks from the latest BOD assessment."
                    </div>
                    <div class="suggestion-card">
                        "Generate a remediation plan for failing PR.DS controls."
                    </div>
                    <div class="suggestion-card">
                        "Show trend of mean-time-to-remediate over last 90 days."
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. SPA Router
    const routes = ['/', '/dashboard', '/framework', '/risks', '/assessments', '/supply-chain', '/incidents', '/reports', '/ai'];
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');

    function navigate() {
        let hash = window.location.hash.slice(1) || '/';
        if (!routes.includes(hash)) hash = '/';

        // Update nav active state
        navLinks.forEach(link => {
            if (link.getAttribute('data-route') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Hide all views, show target
        views.forEach(view => view.classList.remove('active'));
        
        const targetViewId = hash === '/' ? 'view-landing' : `view-${hash.slice(1)}`;
        const targetView = document.getElementById(targetViewId);
        
        if (targetView) {
            targetView.classList.add('active');
            // Trigger chart renders if navigating to dashboard
            if (hash === '/dashboard' && window.GenesisCharts) {
                setTimeout(() => window.GenesisCharts.renderDashboardRadar(), 100);
            }
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', navigate);
    
    // Initial navigation
    navigate();

    // 3. Animate numbers on landing page
    if (window.location.hash === '' || window.location.hash === '#/') {
        animateValue("stat-agencies", 0, 142, 2000);
        animateValue("stat-controls", 0, 15480, 2500);
        animateValue("stat-threats", 0, 8924, 3000);
    }
    
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    // 4. Initialize Main Frame and Data Binding
    async function initializeSystem() {
        if (window.MainFrame) {
            await window.MainFrame.initialize();
            
            // Listen for real-time syncs
            document.addEventListener('genesis:sync', (e) => {
                updateDashboardKPIs(e.detail.state);
            });
            
            // Initial render
            const state = await window.MainFrame.getSystemState();
            updateDashboardKPIs(state);
            
            const alerts = await window.MainFrame.getAlerts();
            const supplyChain = await window.MainFrame.getSupplyChainData();
            const framework = await window.MainFrame.getFrameworkData();
            const risks = await window.MainFrame.getRisksData();
            
            if (window.GenesisData) {
                window.GenesisData.alerts = alerts;
                window.GenesisData.framework = framework;
                window.GenesisData.risks = risks;
                
                window.GenesisData.populateAlerts();
                window.GenesisData.populateFramework();
                window.GenesisData.populateRisks();
                window.GenesisData.populateSupplyChain(supplyChain);
            }
            
            initializeAI();
        }
    }
    
    function initializeAI() {
        const input = document.getElementById('ai-chat-input');
        const btn = document.getElementById('ai-chat-btn');
        const history = document.querySelector('.chat-history');
        
        if (!input || !btn || !history) return;
        
        const sendMsg = async () => {
            const val = input.value.trim();
            if (!val) return;
            
            // Add user message
            history.innerHTML += \`
                <div class="chat-msg msg-user">
                    \${val}
                </div>
            \`;
            input.value = '';
            
            // Show typing indicator
            const typingId = 'typing-' + Date.now();
            history.innerHTML += \`
                <div id="\${typingId}" class="chat-msg msg-ai">
                    <span class="live-indicator"></span> Analyzing telemetry...
                </div>
            \`;
            history.scrollTop = history.scrollHeight;
            
            // Process query via Main Frame
            const result = await window.MainFrame.processAiQuery(val);
            
            // Replace typing indicator with response
            const typingEl = document.getElementById(typingId);
            if (typingEl) {
                typingEl.innerHTML = \`<strong>System:</strong> \${result.response}\`;
            }
            history.scrollTop = history.scrollHeight;
        };
        
        btn.addEventListener('click', sendMsg);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMsg();
        });
        
        // Wire up suggestion cards
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                input.value = card.textContent.trim().replace(/"/g, '');
                sendMsg();
            });
        });
    }
    
    function updateDashboardKPIs(state) {
        const scoreEl = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
        if (scoreEl) scoreEl.textContent = state.complianceScore.toFixed(1) + '%';
        
        const risksEl = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
        if (risksEl) risksEl.textContent = state.activeRisks;
        
        const poamsEl = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
        if (poamsEl) poamsEl.textContent = state.openPoams;
        
        const mttrEl = document.querySelector('.kpi-card:nth-child(4) .kpi-value');
        if (mttrEl) mttrEl.textContent = state.mttr.toFixed(1) + 'h';
    }

    initializeSystem();
});
