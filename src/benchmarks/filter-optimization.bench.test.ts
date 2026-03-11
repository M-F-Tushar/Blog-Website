import { describe, it } from 'vitest';

describe('Filter Optimization Benchmark', () => {
  const ARRAY_SIZE = 10000;
  const FILTER_SIZE = 500;

  const largeArray = Array.from({ length: ARRAY_SIZE }, (_, i) => `item-${i}`);
  const filterCriteria = Array.from({ length: FILTER_SIZE }, (_, i) => `item-${i * 2}`);
  const filterSet = new Set(filterCriteria);

  it('Benchmark: Array.includes in filter', () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
        largeArray.filter(item => filterCriteria.includes(item));
    }
    const end = performance.now();
    console.log(`Array.includes baseline: ${(end - start) / 10}ms`);
  });

  it('Benchmark: Set.has in filter', () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
        largeArray.filter(item => filterSet.has(item));
    }
    const end = performance.now();
    console.log(`Set.has optimization: ${(end - start) / 10}ms`);
  });

  it('Benchmark: string.toLowerCase in filter', () => {
    const searchQuery = 'ITEM';
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
        largeArray.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    const end = performance.now();
    console.log(`String.toLowerCase baseline: ${(end - start) / 100}ms`);
  });

  it('Benchmark: hoisted string.toLowerCase', () => {
    const searchQuery = 'ITEM';
    const start = performance.now();
    const lowerQuery = searchQuery.toLowerCase();
    for (let i = 0; i < 100; i++) {
        largeArray.filter(item => item.toLowerCase().includes(lowerQuery));
    }
    const end = performance.now();
    console.log(`Hoisted string.toLowerCase: ${(end - start) / 100}ms`);
  });
});
