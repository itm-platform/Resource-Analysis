import { describe, expect, test } from 'vitest';
import { retrieveTypeOrder } from '../utils';

describe('retrieveTypeOrder Tests', () => {
    test('should return correct type order for a simple nested structure', () => {
        const dataset = [
            {
                type: 'entity',
                children: [
                    {
                        type: 'workItem',
                        children: [
                            {
                                type: 'user',
                                children: []
                            }
                        ]
                    }
                ]
            }
        ];
        const result = retrieveTypeOrder(dataset);
        expect(result).toEqual(['entity', 'workItem', 'user']);
    });

    test('should handle empty dataset', () => {
        const dataset = [];
        const result = retrieveTypeOrder(dataset);
        expect(result).toEqual([]);
    });

    test('should throw an error if node structure is inconsistent', () => {
        const dataset = [
            {
                type: 'entity',
                children: [
                    {
                        type: 'workItem',
                        children: [
                            {
                                type: 'user',
                                children: []
                            }
                        ]
                    },
                    {
                        type: 'user',  // Inconsistent type at the same depth level
                        children: []
                    }
                ]
            }
        ];
        expect(() => retrieveTypeOrder(dataset)).toThrow();
    });

    test('should throw an error for invalid node data', () => {
        const dataset = [
            {
                type: 'entity',
                children: [
                    {
                        children: [
                            {
                                type: 'user',
                                children: []
                            }
                        ]
                    }
                ]
            }
        ];
        expect(() => retrieveTypeOrder(dataset)).toThrow();
    });

    test('should handle datasets without children property', () => {
        const dataset = [
            {
                type: 'entity',
                children: [
                    {
                        type: 'workItem'
                    }
                ]
            }
        ];
        const result = retrieveTypeOrder(dataset);
        expect(result).toEqual(['entity', 'workItem']);
    });

    test('should handle complex nested structures', () => {
        const dataset = [
            {
                type: 'entity',
                children: [
                    {
                        type: 'workItem',
                        children: [
                            {
                                type: 'user',
                                children: [
                                    {
                                        type: 'detail',
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
        const result = retrieveTypeOrder(dataset);
        expect(result).toEqual(['entity', 'workItem', 'user', 'detail']);
    });

    describe('retrieveTypeOrder with originalTypes as Array Tests', () => {
        test('should filter types based on originalTypes array', () => {
            const dataset = [
                {
                    type: 'entity',
                    children: [
                        {
                            type: 'workItem',
                            children: [
                                {
                                    type: 'user',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ];
            const originalTypes = ['user', 'workItem'];
            const result = retrieveTypeOrder(dataset, originalTypes);
            expect(result).toEqual(['workItem', 'user']);
        });

        test('should ignore types not in originalTypes array', () => {
            const dataset = [
                {
                    type: 'entity',
                    children: [
                        {
                            type: 'workItem',
                            children: [
                                {
                                    type: 'user',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ];
            const originalTypes = ['user'];
            const result = retrieveTypeOrder(dataset, originalTypes);
            expect(result).toEqual(['user']);
        });

        test('should return an empty array if none of the originalTypes are present', () => {
            const dataset = [
                {
                    type: 'entity',
                    children: [
                        {
                            type: 'workItem',
                            children: []
                        }
                    ]
                }
            ];
            const originalTypes = ['potato'];
            const result = retrieveTypeOrder(dataset, originalTypes);
            expect(result).toEqual([]);
        });

        test('should handle case with empty originalTypes array', () => {
            const dataset = [
                {
                    type: 'entity',
                    children: [
                        {
                            type: 'workItem',
                            children: []
                        }
                    ]
                }
            ];
            const originalTypes = [];  // Empty array
            const result = retrieveTypeOrder(dataset, originalTypes);
            expect(result).toEqual(['entity', 'workItem']);  // Should return all types because originalTypes is empty
        });
    });

});



