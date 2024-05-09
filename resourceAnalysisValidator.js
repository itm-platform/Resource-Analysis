// resourceAnalysisValidator.js
export default {
    validateResponse(response) {
        if (!response.Entities || !response.Users || !response.Categories) {
            throw new Error('Missing one of the main objects: Entities, Users, or Categories.');
        }

        const isIntervals = response.Intervals !== undefined;
        const userCapacities = {};

        response.Entities.forEach(entity => {
            if (!entity.Id || !entity.Name) {
                throw new Error('Each entity must have an "Id" and "Name".');
            }
            if (!['project', 'service'].includes(entity.EntityType)) {
                throw new Error('EntityType must be either "project" or "service".');
            }
            if (entity.EntitySubType && !['waterfall', 'agile'].includes(entity.EntitySubType)) {
                throw new Error(`EntitySubType must be either "waterfall" or "agile" if specified. Found: ${entity.EntitySubType} at ${entity.Name}`);
            }

            entity.WorkItems.forEach(workItem => {
                if (!workItem.Id || !workItem.Name) {
                    throw new Error(`Each work item must have an "Id" and "Name".'. Found: ${workItem.Id} and ${workItem.Name}`);
                }

                workItem.AssignedEfforts.forEach(effort => {
                    if (!isIntervals && !effort.TotalUserWorkItemEffort) {
                        throw new Error(`All users per work item must have "TotalUserWorkItemEffort". Found: ${effort.UserId} at ${workItem.Name}`);
                    }

                    if (isIntervals) {
                        if (effort.Intervals.length !== response.Intervals.length) {
                            throw new Error(`All AssignedEfforts per work item must have the same number of Intervals as the main Intervals object. Found: ${effort.UserId} at ${workItem.Name}`);
                        }

                        effort.Intervals.forEach(interval => {
                            const key = `${effort.UserId}_${interval.IntervalId}`;
                            if (interval.Capacity === undefined) {
                                throw new Error(`Missing capacity for user ${effort.UserId} at interval ${interval.IntervalId}`);
                            }

                            if (userCapacities[key] === undefined) {
                                userCapacities[key] = interval.Capacity;
                            } else if (userCapacities[key] !== interval.Capacity) {
                                throw new Error(`Inconsistency found: User ${effort.UserId} has capacities ${userCapacities[key]} and ${interval.Capacity} for IntervalId ${interval.IntervalId} across different work items. Difference found in work item with Id ${workItem.Id} and Name "${workItem.Name}".`);
                            }
                        });
                    }
                });
            });
        });


        // Validate Users
        const seenIds = new Set();
        const duplicateIds = [];

        response.Users.forEach(user => {
            if (!user.Id || !user.Name) {
                throw new Error(`Each user must have an "Id" and "Name". Found: ${user.Id} and ${user.Name}`);
            }
            if (seenIds.has(user.Id)) {
                duplicateIds.push(user.Id);
            } else {
                seenIds.add(user.Id);
            }
        });

        if (duplicateIds.length > 0) {
            throw new Error(`Duplicate IDs detected: ${duplicateIds.join(", ")}`);
        }



        // Validate Intervals
        if (isIntervals) {
            response.Intervals.forEach(interval => {
                if (!interval.IntervalId || !interval.IntervalName) {
                    throw new Error(`Each interval must have an "IntervalId" and "IntervalName". Found: ${interval.IntervalId} and ${interval.IntervalName}`);
                }
            });
        }
        // Validate Categories
        response.Categories.forEach(category => {
            if (!category.Id || !category.Name) {
                throw new Error(`Each category must have an "Id" and "Name". Found: ${category.Id} and ${category.Name}`);
            }
        });
    },
    validateRequest(request) {
        // Check if analysisMode is present and valid
        if (!request.analysisMode || (request.analysisMode !== 'intervals' && request.analysisMode !== 'totals')) {
            throw new Error('Invalid analysisMode: must be either "intervals" or "totals".');
        }

        // Validate intervals if analysisMode is intervals
        if (request.analysisMode === 'intervals') {
            if (!request.intervals) {
                throw new Error('Intervals section is required for analysisMode "intervals".');
            }

            if (!request.intervals.startDate || typeof request.intervals.startDate !== 'string') {
                throw new Error('Invalid or missing startDate in intervals.');
            }

            if (!request.intervals.intervalType || typeof request.intervals.intervalType !== 'string') {
                throw new Error('Invalid or missing intervalType in intervals.');
            }

            if (!['day', 'week', 'month', 'quarter'].includes(request.intervals.intervalType)) {
                throw new Error('Invalid intervalType in intervals. Must be one of: day, week, month, quarter.');
            }

            if (!request.intervals.noOfIntervals || typeof request.intervals.noOfIntervals !== 'number') {
                throw new Error('Invalid or missing noOfIntervals in intervals.');
            }
        }

        if (request.filter) {
            ['project', 'service', 'user'].forEach(filterKey => {
                if (request.filter[filterKey] && typeof request.filter[filterKey] !== 'object') {
                    throw new Error(`Filter for ${filterKey} should be an object with valid query parameters.`);
                }
            });
        }
    }
};