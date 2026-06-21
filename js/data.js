// js/data.js

window.GenesisData = {
    alerts: [
        { level: 'critical', msg: 'Unauthorized access attempt detected on SEC-004', time: '2 mins ago' },
        { level: 'high', msg: 'CISA BOD 22-01: 3 critical vulnerabilities unpatched', time: '1 hour ago' },
        { level: 'high', msg: 'Assessment #4492 (NIST SP 800-53) marked overdue', time: '3 hours ago' },
        { level: 'info', msg: 'System backup completed successfully (US-EAST)', time: '5 hours ago' },
        { level: 'medium', msg: 'Unusual outbound traffic spike in subnet B', time: '6 hours ago' }
    ],

    framework: [
        {
            id: 'ID', name: 'Identify', score: 78,
            controls: [
                { id: 'ID.AM-1', desc: 'Physical devices and systems within the organization are inventoried', status: 'Implemented', progress: 100 },
                { id: 'ID.AM-2', desc: 'Software platforms and applications within the organization are inventoried', status: 'Partial', progress: 65 },
                { id: 'ID.GV-1', desc: 'Organizational information security policy is established', status: 'Implemented', progress: 100 }
            ]
        },
        {
            id: 'PR', name: 'Protect', score: 62,
            controls: [
                { id: 'PR.AC-1', desc: 'Identities and credentials are managed for authorized devices and users', status: 'Partial', progress: 50 },
                { id: 'PR.DS-1', desc: 'Data-at-rest is protected', status: 'Implemented', progress: 90 },
                { id: 'PR.PT-1', desc: 'Audit/log records are determined, documented, implemented, and reviewed', status: 'Gap', progress: 30 }
            ]
        },
        {
            id: 'DE', name: 'Detect', score: 85,
            controls: [
                { id: 'DE.AE-1', desc: 'A baseline of network operations and expected data flows is established', status: 'Implemented', progress: 100 },
                { id: 'DE.CM-1', desc: 'The network is monitored to detect potential cybersecurity events', status: 'Implemented', progress: 95 }
            ]
        },
        { id: 'RS', name: 'Respond', score: 90, controls: [] },
        { id: 'RC', name: 'Recover', score: 75, controls: [] }
    ],

    risks: [
        { id: 'RSK-001', desc: 'Legacy systems lack MFA support', cat: 'Identity', severity: 'Critical', status: 'Open', owner: 'J. Smith' },
        { id: 'RSK-002', desc: 'Incomplete asset inventory (Cloud)', cat: 'Asset Mgmt', severity: 'High', status: 'Mitigating', owner: 'A. Davis' },
        { id: 'RSK-003', desc: 'Third-party vendor SOC2 expired', cat: 'Supply Chain', severity: 'High', status: 'Open', owner: 'M. Wong' },
        { id: 'RSK-004', desc: 'Lack of automated log analysis', cat: 'Detection', severity: 'Medium', status: 'Accepted', owner: 'T. Baker' },
        { id: 'RSK-005', desc: 'Employee phishing training overdue', cat: 'Awareness', severity: 'Low', status: 'Closed', owner: 'L. Chen' }
    ],

    populateAlerts: function() {
        const container = document.getElementById('dashboard-alerts');
        if (!container) return;
        
        let html = '';
        this.alerts.forEach(alert => {
            html += `
                <div class="alert-item ${alert.level}">
                    <div class="alert-time">${alert.time}</div>
                    <div class="alert-msg">${alert.msg}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    populateFramework: function() {
        const listContainer = document.getElementById('framework-functions');
        if (!listContainer) return;

        let html = '';
        this.framework.forEach((func, idx) => {
            const colorClass = func.score > 80 ? 'status-secure' : (func.score > 60 ? 'status-medium' : 'status-critical');
            html += `
                <div class="function-item ${idx === 0 ? 'active' : ''}" onclick="window.GenesisData.selectFunction('${func.id}')">
                    <div class="function-header">
                        <span class="function-title">${func.id} - ${func.name}</span>
                        <span class="function-score" style="color: var(--color-${colorClass})">${func.score}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${func.score}%; background: var(--color-${colorClass})"></div>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
        this.selectFunction('ID'); // default select
    },

    selectFunction: function(id) {
        const detailContainer = document.getElementById('framework-controls');
        if (!detailContainer) return;
        
        const func = this.framework.find(f => f.id === id);
        if (!func) return;

        // Update active class
        document.querySelectorAll('.function-item').forEach(el => {
            el.classList.remove('active');
            if (el.innerHTML.includes(id + ' -')) el.classList.add('active');
        });

        let html = `<h3 style="margin-bottom: 1rem;">${func.name} Controls</h3>`;
        
        if (!func.controls || func.controls.length === 0) {
            html += `<p>Data synchronization in progress...</p>`;
        } else {
            func.controls.forEach(ctrl => {
                const badgeClass = ctrl.progress === 100 ? 'status-secure' : (ctrl.progress > 50 ? 'status-medium' : 'status-critical');
                html += `
                    <div class="control-card">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div>
                                <span class="control-id">${ctrl.id}</span>
                                <span class="status-badge ${badgeClass}">${ctrl.status}</span>
                            </div>
                            <span style="font-size: 0.8rem">${ctrl.progress}%</span>
                        </div>
                        <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">${ctrl.desc}</p>
                        <div class="progress-container" style="height: 4px;">
                            <div class="progress-bar" style="width: ${ctrl.progress}%; background: var(--color-${badgeClass})"></div>
                        </div>
                    </div>
                `;
            });
        }
        detailContainer.innerHTML = html;
    },

    populateRisks: function() {
        const tbody = document.querySelector('#risks-table tbody');
        if (!tbody) return;

        let html = '';
        this.risks.forEach(risk => {
            const sevClass = 'status-' + risk.severity.toLowerCase();
            html += `
                <tr>
                    <td style="font-family: var(--font-family-mono)">${risk.id}</td>
                    <td><strong>${risk.desc}</strong></td>
                    <td>${risk.cat}</td>
                    <td><span class="status-badge ${sevClass}">${risk.severity}</span></td>
                    <td>${risk.status}</td>
                    <td>${risk.owner}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    populateSupplyChain: function(data) {
        const tbody = document.querySelector('#supply-chain-table tbody');
        if (!tbody || !data) return;

        let html = '';
        data.forEach(vendor => {
            const sevClass = vendor.riskScore > 80 ? 'status-critical' : (vendor.riskScore > 50 ? 'status-high' : 'status-secure');
            html += `
                <tr>
                    <td><strong>${vendor.vendor}</strong></td>
                    <td>Tier ${vendor.tier}</td>
                    <td><span style="color: var(--color-${sevClass}); font-weight: bold;">${vendor.riskScore}</span></td>
                    <td>${vendor.vulnerabilities}</td>
                    <td><span class="status-badge ${sevClass}">${vendor.status}</span></td>
                    <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.8rem;">Isolate</button></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
};
