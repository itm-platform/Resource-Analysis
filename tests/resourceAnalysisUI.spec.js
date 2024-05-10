import { describe, test, expect, beforeEach } from 'vitest';
import { ResourceAnalysis } from '../resourceAnalysis.js';

// Simulate local storage
global.localStorage = {
  storage: {},
  setItem: function (key, value) {
    this.storage[key] = value;
  },
  getItem: function (key) {
    return this.storage[key];
  },
  removeItem: function (key) {
    delete this.storage[key];
  },
  clear: function () {
    this.storage = {};
  }
};

describe('ResourceAnalysis Initialization', () => {
  beforeEach(() => {
    // Set item in local storage as required
    localStorage.setItem('testingWithLocalFiles', 'true');

    // Simulate the necessary DOM structure
    document.body.innerHTML = `
      <div id="requestConstructorContainer"></div>
      <div id="rowSelectorContainer"></div>
      <div id="tableContainer"></div>
      <button id="loadAnalysisBtn">Load Analysis</button>
    `;
  });

  test('ResourceAnalysis should initialize without throwing', () => {
    expect(() => {
      const parentDivIds = {
        requestConstructorContainer: 'requestConstructorContainer',
        rowSelectorContainer: 'rowSelectorContainer',
        tableContainer: 'tableContainer'
      };
      const resourceAnalysis = new ResourceAnalysis(parentDivIds);
    }).not.toThrow();
  });
});
