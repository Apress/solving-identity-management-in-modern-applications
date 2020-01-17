export class PromisingSecureStorage {
    constructor(ss) {
      this.ss = ss;
    }
  
    static create() {
      return new Promise((resolve, reject) => {
        const ss = new window.cordova.plugins.SecureStorage(() => {
          resolve(ss);
        }, (err) => reject(err), "hydra-app");
      }).then((x) => new PromisingSecureStorage(x));
    }
  
    get(key) {
      return new Promise((resolve, reject) => {
        this.ss.get((value) => resolve(value), (err) => reject(err), key);
      }); 
    }
  
    set(key, value) {
      return new Promise((resolve, reject) => {
        this.ss.set((value) => resolve(value), (err) => reject(err), key, value);
      }); 
    }
  
    remove(key) {
      return new Promise((resolve, reject) => {
        this.ss.remove(() => resolve(), (err) => reject(err), key);
      }); 
    }
  
    removeAll() {
      return new Promise((resolve, reject) => {
        this.ss.clear(() => resolve(), (err) => reject(err));
      }); 
    }
  }