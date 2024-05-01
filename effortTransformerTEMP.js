// effortTransformer.js
// TODO - A - In the ByEntity views, add a switch task/user to user/task
export class EffortTransformer {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data));
    }
    transformToIntervals(groupBy, groupEntityBy) {
        this.#setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this.#buildIntervalGroups(groupBy === 'user'); // Include capacity if grouped by user

        if (groupBy === 'entity') {
            return { groups, rows: this.#transformByEntity('intervals', groupEntityBy) };
        } else if (groupBy === 'user') {
            //...
        } else {
            throw new Error('Invalid groupBy value. Use "entity" or "user".');
        }
    }

    transformToTotals(groupBy, groupEntityBy) {
        const groups = this.#buildTotalsGroups();
        if (groupBy === 'entity') {
            return { groups, rows: this.#transformByEntity('totals', groupEntityBy) };
        } else if (groupBy === 'user') {
           //..;
        } else {
            throw new Error('Invalid groupBy value. Use "entity" or "user".');
        }
    }


    #transformByEntity(intervalsOrTotals, groupEntityBy = 'workItem') {
        const isIntervals = intervalsOrTotals === 'intervals';
    
        const buildEntityRows = this.data.Entities.map(entity => {
            if (groupEntityBy === 'workItem') {
                return this.#groupEntityByWorkItem(entity, isIntervals);
            } else if (groupEntityBy === 'user') {
                return this.#groupEntityByUser(entity, isIntervals);
            } else {
                throw new Error('Invalid groupEntityBy value. Use "workItem" or "user".');
            }
        });
    
        return buildEntityRows;
    }
    #groupEntityByWorkItem(entity, isIntervals) {
        const workItems = entity.WorkItems.map(workItem => {
            const userRows = workItem.AssignedEfforts.map(effort => {
                const user = this.#getUserById(effort.UserId);
                const values = isIntervals ? this.#buildIntervalValues(effort.Intervals) : [{
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: effort.TotalUserWorkItemEffort.EstimatedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.EstimatedEffort } } },
                        { columnId: "actual", value: effort.TotalUserWorkItemEffort.AcceptedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.AcceptedEffort } } }
                    ]
                }];
                return this.#createUserRow(user, { values });
            });
    
            const workItemValues = this.#aggregateWorkItemValues(userRows);
            return {
                type: "workItem",
                name: workItem.Name,
                values: workItemValues,
                children: userRows
            };
        });
    
        const entityValues = this.#aggregateEntityValues(workItems);
        return {
            type: entity.EntityType,
            name: entity.Name,
            subType: entity.EntitySubType,
            render: this.#renderEntity(entity),
            values: entityValues,
            children: workItems
        };
    }
    #groupEntityByUser(entity, isIntervals) {
        // THIS IS THE CODE THAT NEEDS TO BE DONE, ALONG WITH ANY NEW METHODS OR ADJUSTMENTS IN EXISTING ONES
        
    }
    #getUserById(userId) {
       // irrelevant code
    }

    #renderEntity(entity) {
        return {
            func: "renderEntityName",
            params: {
                name: entity.Name,
                entityType: entity.EntityType,
                entitySubType: entity.EntitySubType
            }
        };
    };

    transformToTotalsByEntity() {
        const groups = this.#buildTotalsGroups();

        const rows = this.data.Entities.map(entity => {
            const mapEntity = (workItem) => {
                const userRows = workItem.AssignedEfforts.map(assignedEffort => {
                    const user = this.#getUserById(assignedEffort.UserId);
                    const totals = assignedEffort.TotalUserWorkItemEffort;
                    const values = [{
                        groupId: 1,
                        values: [
                            { columnId: "estimated", value: totals.EstimatedEffort, render: { func: "renderDuration", params: { value: totals.EstimatedEffort } } },
                            { columnId: "actual", value: totals.AcceptedEffort, render: { func: "renderDuration", params: { value: totals.AcceptedEffort } } }
                        ]
                    }];
                    return this.#createUserRow(user, { values });
                });

                const workItemTotals = this.#aggregateWorkItemValues(userRows);
                return {
                    type: "workItem",
                    name: workItem.Name,
                    values: workItemTotals,
                    children: userRows
                };
            };

            const workItemRows = entity.WorkItems.map(mapEntity);

            const entityTotals = this.#aggregateEntityValues(workItemRows);
            return {
                type: entity.EntityType,
                name: entity.Name,
                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                values: entityTotals,
                children: workItemRows
            };
        });

        return { groups, rows };
    }

    #aggregateWorkItemValues(userRows) {
        const flatValues = userRows.flatMap(user => user.values);
        return this.#sumValuesByGroup(flatValues);
    }
    #setCapacity0ToRepeatedIntervalAndUsers() {
       // irrelevant code
    }
    #createUserRow(user, additionalValues = {}) {
        return {
            type: "user",
            id: user.Id,
            name: user.Name,
            imageUrl: user.UserImageUrl,
            categoryId: user.CategoryId,
            render: {
                func: "renderUserName",
                params: {
                    id: user.Id,
                    name: user.Name,
                    imageUrl: user.UserImageUrl,
                    categoryId: user.CategoryId
                }
            },
            ...additionalValues
        };
    }

    #buildTotalsGroups() {
        // irrelevant code
    }

    #buildIntervalGroups(includeCapacity = false) {
       // irrelevant code
    }
    #buildIntervalValues(intervals) {
       // irrelevant code
    }
    #aggregateEntityValues(workItems) {
        const flatValues = workItems.flatMap(workItem => workItem.values);
        return this.#sumValuesByGroup(flatValues);
    }

    #sumValuesByGroup(values) {
        const groupMap = new Map();
        for (const valueGroup of values) {
            for (const value of valueGroup.values) {
                const existing = groupMap.get(valueGroup.groupId) || {};
                existing[value.columnId] = (existing[value.columnId] || 0) + value.value;
                groupMap.set(valueGroup.groupId, existing);
            }
        }

        return Array.from(groupMap).map(([groupId, columns]) => ({
            groupId,
            values: Object.keys(columns).map(columnId => ({
                columnId,
                value: columns[columnId],
                render: { func: "renderDuration", params: { value: columns[columnId] } }
            }))
        }));
    }
}
