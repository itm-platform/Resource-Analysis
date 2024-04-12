export default {
    validate(response) {
        if (!response.Entities || !response.Users || !response.Categories) {
            throw new Error('Missing one of the main objects: Entities, Users, or Categories.');
        }
    
        const userCapacities = {};
    
        // Validate Entities and WorkItems
        response.Entities.forEach(entity => {
            if (!entity.Id || !entity.Name) {
                throw new Error('Each entity must have an "Id" and "Name".');
            }
            if (!['project', 'service'].includes(entity.EntityType)) {
                throw new Error('EntityType must be either "project" or "service".');
            }
            if (entity.EntitySubType && !['waterfall', 'agile'].includes(entity.EntitySubType)) {
                throw new Error('EntitySubType must be either "waterfall" or "agile" if specified.');
            }
    
            entity.WorkItems.forEach(workItem => {
                if (!workItem.Id || !workItem.Name) {
                    throw new Error('Each work item must have an "Id" and "Name".');
                }
    
                workItem.AssignedEfforts.forEach(effort => {
                    if (!effort.TotalUserWorkItemEffort) {
                        throw new Error('All users per work item must have "TotalUserWorkItemEffort".');
                    }
                    if (effort.Intervals.length !== response.Intervals.length) {
                        throw new Error('All AssignedEfforts per work item must have the same number of Intervals as the main Intervals object.');
                    }
    
                    effort.Intervals.forEach(interval => {
                        const key = `${effort.UserId}_${interval.IntervalId}`;
                        if (userCapacities[key] !== undefined) {
                            if (userCapacities[key] !== interval.Capacity) {
                                throw new Error(`Inconsistency found: User ${effort.UserId} has capacities ${userCapacities[key]} and ${interval.Capacity} for IntervalId ${interval.IntervalId} across different work items. Difference found in work item with Id ${workItem.Id} and Name "${workItem.Name}".`);
                            }
                        } else {
                            userCapacities[key] = interval.Capacity; // Initialize if not already set
                        }
                    });
                });
            });
        });
    

    // Validate Users
    response.Users.forEach(user => {
        if (!user.Id || !user.Name) {
            throw new Error('Each user must have an "Id" and "Name".');
        }
    });

    // Validate Intervals
    if (response.Intervals) {
        response.Intervals.forEach(interval => {
            if (!interval.IntervalId || !interval.IntervalName) {
                throw new Error('Each interval must have an "IntervalId" and "IntervalName".');
            }
        });
    } else {
        throw new Error('Intervals object is missing.');
    }

    // Validate Categories
    response.Categories.forEach(category => {
        if (!category.Id || !category.Name) {
            throw new Error('Each category must have an "Id" and "Name".');
        }
    });
}

};