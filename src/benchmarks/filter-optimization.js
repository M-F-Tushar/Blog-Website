const ARRAY_SIZE = 10000;
const FILTER_SIZE = 500;

const largeArray = Array.from({ length: ARRAY_SIZE }, (_, i) => `item-${i}`);
const filterCriteria = Array.from({ length: FILTER_SIZE }, (_, i) => `item-${i * 2}`);
const filterSet = new Set(filterCriteria);

console.log('--- Membership Check Benchmark ---');

let start = performance.now();
for (let i = 0; i < 50; i++) {
    largeArray.filter(item => filterCriteria.includes(item));
}
let end = performance.now();
console.log(`Array.includes baseline: ${((end - start) / 50).toFixed(4)}ms`);

start = performance.now();
for (let i = 0; i < 50; i++) {
    largeArray.filter(item => filterSet.has(item));
}
end = performance.now();
console.log(`Set.has optimization: ${((end - start) / 50).toFixed(4)}ms`);

console.log('\n--- String toLowerCase Benchmark ---');

const searchQuery = 'ITEM';
start = performance.now();
for (let i = 0; i < 1000; i++) {
    largeArray.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
}
end = performance.now();
console.log(`String.toLowerCase baseline: ${((end - start) / 1000).toFixed(4)}ms`);

start = performance.now();
const lowerQuery = searchQuery.toLowerCase();
for (let i = 0; i < 1000; i++) {
    largeArray.filter(item => item.toLowerCase().includes(lowerQuery));
}
end = performance.now();
console.log(`Hoisted string.toLowerCase: ${((end - start) / 1000).toFixed(4)}ms`);
