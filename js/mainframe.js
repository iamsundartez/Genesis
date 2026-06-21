// js/mainframe.js
/**
 * Genesis Main Frame Simulator
 * Acts as the centralized data orchestration and compute engine for the platform.
 */

class GenesisMainFrame {
    constructor() {
        this.isInitialized = false;
        this.systemId = 'core_state';
    }

    async initialize() {
        console.log("[MAIN FRAME] Initializing core orchestration services...");
        
        // Connect to Database
        await window.DB.init();
        
        // Seed initial data if DB is empty
        const count = await window.DB.count(window.DB.stores.SYSTEM);
        if (count === 0) {
            console.log("[MAIN FRAME] First boot detected. Seeding data ecosystem...");
            await this.generateInitialData();
        }

        this.isInitialized = true;
        console.log("[MAIN FRAME] Initialization complete. Data ecosystem active.");
        
        // Start simulated real-time data sync
        this.startDataOrchestration();
    }

    async generateInitialData() {
        // Seed System State
        const initialState = {
            id: this.systemId,
            complianceScore: 84.2,
            activeRisks: 12,
            openPoams: 47,
            mttr: 4.2,
            lastSync: new Date().toISOString()
        };
        await window.DB.put(window.DB.stores.SYSTEM, initialState);

        // Seed Alerts
        const initialAlerts = [
            { type: 'critical', msg: 'Anomalous access pattern detected in Agency Beta subnet.', time: 'Just now' },
            { type: 'high', msg: 'Unpatched vulnerability (CVE-2026-1049) spotted in external facing asset.', time: '2 mins ago' },
            { type: 'info', msg: 'Routine compliance scan completed. 4 controls updated.', time: '15 mins ago' }
        ];
        for (const alert of initialAlerts) {
            await window.DB.add(window.DB.stores.ALERTS, alert);
        }

        // Seed Supply Chain
        const initialSupplyChain = [
            { vendor: 'GovTech Solutions', tier: 1, riskScore: 85, status: 'Critical', vulnerabilities: 3 },
            { vendor: 'SecureNet Cloud', tier: 1, riskScore: 22, status: 'Stable', vulnerabilities: 0 },
            { vendor: 'Global Logistics API', tier: 2, riskScore: 65, status: 'Elevated', vulnerabilities: 1 }
        ];
        for (const vendor of initialSupplyChain) {
            await window.DB.put(window.DB.stores.SUPPLY_CHAIN, vendor);
        }
        
        // Seed Framework and Risks from data.js if available
        if (window.GenesisData) {
            for (const func of window.GenesisData.framework) {
                await window.DB.put(window.DB.stores.FRAMEWORK, func);
            }
            for (const risk of window.GenesisData.risks) {
                await window.DB.put(window.DB.stores.RISKS, risk);
            }
        }
    }

    async startDataOrchestration() {
        setInterval(async () => {
            if (!this.isInitialized) return;
            
            try {
                // Fetch current state
                let state = await window.DB.get(window.DB.stores.SYSTEM, this.systemId);
                
                // Randomly update system metrics to simulate real-time data integration
                state.complianceScore += (Math.random() - 0.5) * 0.2;
                state.complianceScore = Math.max(0, Math.min(100, state.complianceScore));
                state.lastSync = new Date().toISOString();
                
                // Persist update
                await window.DB.put(window.DB.stores.SYSTEM, state);
                
                // Dispatch event so UI can update
                document.dispatchEvent(new CustomEvent('genesis:sync', { 
                    detail: { state: state } 
                }));
            } catch (err) {
                console.error("[MAIN FRAME] Sync error:", err);
            }
        }, 5000); // sync every 5 seconds
    }

    // --- Service API Endpoints (Database backed) ---

    async getSystemState() {
        await this._simulateNetwork();
        return await window.DB.get(window.DB.stores.SYSTEM, this.systemId);
    }

    async getAlerts() {
        await this._simulateNetwork();
        return await window.DB.getAll(window.DB.stores.ALERTS);
    }

    async getSupplyChainData() {
        await this._simulateNetwork();
        return await window.DB.getAll(window.DB.stores.SUPPLY_CHAIN);
    }

    async getFrameworkData() {
        await this._simulateNetwork();
        return await window.DB.getAll(window.DB.stores.FRAMEWORK);
    }

    async getRisksData() {
        await this._simulateNetwork();
        return await window.DB.getAll(window.DB.stores.RISKS);
    }

    async processAiQuery(query) {
        await this._simulateNetwork(1000); // AI takes longer
        
        const lowerQuery = query.toLowerCase();
        let response = "";

        if (lowerQuery.includes("supply chain") || lowerQuery.includes("vendor")) {
            const scData = await this.getSupplyChainData();
            const highestRisk = scData.reduce((prev, current) => (prev.riskScore > current.riskScore) ? prev : current, scData[0]);
            response = `I have analyzed the supply chain data in the database. The highest risk vendor is currently '${highestRisk.vendor}' with a risk score of ${highestRisk.riskScore} due to ${highestRisk.vulnerabilities} active vulnerabilities. I recommend isolating their data feeds.`;
        } else if (lowerQuery.includes("remediation") || lowerQuery.includes("pr.ds")) {
            response = "For failing PR.DS (Data Security) controls, the recommended remediation plan is: 1) Enforce AES-256 encryption on all S3 buckets. 2) Implement strict IAM role boundaries for data access. 3) Enable audit logging for all data modifications.";
        } else if (lowerQuery.includes("risk") || lowerQuery.includes("bod")) {
            const risks = await this.getRisksData();
            const criticalRisks = risks.filter(r => r.severity === 'Critical').length;
            response = `The database indicates there are ${criticalRisks} critical risks currently open. The primary cluster involves outdated identity management protocols in legacy systems.`;
        } else {
            response = "Based on current database telemetry, the platform posture is relatively stable. However, continuous monitoring is advised for lateral movement patterns. Would you like me to run a deep diagnostic?";
        }

        return { response, timestamp: new Date().toISOString() };
    }

    // Utility to simulate network latency
    _simulateNetwork(delay = 100) {
        return new Promise(resolve => setTimeout(resolve, delay + (Math.random() * 100)));
    }
}

// Export a singleton instance
window.MainFrame = new GenesisMainFrame();
