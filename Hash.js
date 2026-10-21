
export default class HashMap {
    constructor(loadFactor = 0.75, capacity = 16){
    this.loadFactor = loadFactor;
    this.capacity = capacity;
    this.buckets = Array(this.capacity).fill(null).map(() => []);
    this.threshold = loadFactor * capacity;
    }
    hash(key) {
        let hashCode = 0;
        const primeNum = 31;
        for (let i = 0; i < key.length; i++) { hashCode = (primeNum * hashCode + key.charCodeAt(i)) % this.capacity; }
        return hashCode;
    }
    needsResize(){
        return this.totalEntryCount() > this.threshold;
    }
    resize() {
        let orig = this.capacity;
        let updated = this.capacity * 2;
        this.capacity = updated;
        this.threshold = this.loadFactor * this.capacity;
        for (let i = orig; i < updated; i++) { this.buckets.push([]); }
    }
    bucket(key) {
        return this.buckets[this.hash(key)] ?? null;
    }
    length() {
        let count = 0;
        this.buckets.forEach(b  => count += b.length);
        return count;
    }
    entry(bucket, key) {
        for (let e of bucket) { if (e.key === key) { return e; } }
        return null;
    }
    data(type){
        const results = [];
        // Iterate through each bucket in map
        this.buckets.forEach(b => {
            // if bucket is empty, skip bucket (no entries)
            if (!b.length) { return; }
            // Iterate through each bucket and push each requested data type into local array
            b.forEach(e => {
                switch(type) {
                    case 'keys':
                        results.push(e.key);
                        break;
                    case 'values':
                        results.push(e.value);
                        break;
                    case 'entries':
                        results.push([e.key, e.value]);
                        break;
                }
            });
        });
        return results ?? [];
    }
    set(key, value) {
        let b = this.bucket(key);
        let e = this.entry(b, key);
        if (e) { e.value = value; }
        else { b.push({ key, value }); }
    }
    get(key) {
        const b = this.bucket(key);
        const e = this.entry(b, key);
        return e !== null ? e.value : undefined;
    }
    remove(key) {
        const b = this.bucket(key);
        const e = this.entry(b, key);
        if (e) {
            b.splice(b.indexOf(e));
            return true;
        }
        else { return false; }
    }
    has(key) {
        const b = this.bucket(key);
        return this.entry(b, key) !== null;
    }
    clear() {
        this.buckets.forEach(b => { b.length = 0; });
    }
    return() {
        return this.buckets;
    }
}