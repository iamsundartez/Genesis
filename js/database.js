// js/database.js
/**
 * Genesis Database Service
 * Provides persistent storage using IndexedDB.
 */

class GenesisDB {
    constructor() {
        this.dbName = 'GenesisPlatformDB';
        this.dbVersion = 1;
        this.db = null;
        
        this.stores = {
            SYSTEM: 'system_state',
            ALERTS: 'alerts',
            SUPPLY_CHAIN: 'supply_chain',
            FRAMEWORK: 'framework_controls',
            RISKS: 'risk_register'
        };
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('[DB] Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('[DB] Connection established successfully.');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('[DB] Upgrading/creating schemas...');

                // Create Object Stores if they don't exist
                if (!db.objectStoreNames.contains(this.stores.SYSTEM)) {
                    db.createObjectStore(this.stores.SYSTEM, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(this.stores.ALERTS)) {
                    db.createObjectStore(this.stores.ALERTS, { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains(this.stores.SUPPLY_CHAIN)) {
                    db.createObjectStore(this.stores.SUPPLY_CHAIN, { keyPath: 'vendor' });
                }
                if (!db.objectStoreNames.contains(this.stores.FRAMEWORK)) {
                    db.createObjectStore(this.stores.FRAMEWORK, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(this.stores.RISKS)) {
                    db.createObjectStore(this.stores.RISKS, { keyPath: 'id' });
                }
            };
        });
    }

    // --- Generic CRUD Operations ---

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async put(storeName, item) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(item);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async add(storeName, item) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(item);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async count(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not initialized');
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.count();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

window.DB = new GenesisDB();
