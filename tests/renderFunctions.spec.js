import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderUserName, renderEntityName, renderDuration } from '../renderFunctions.js';

// Mocking dependencies
vi.mock('../pathResolver.js', () => ({
    resolveIconPath: vi.fn().mockImplementation((iconName) => `/fallbackImages/${iconName}`),
    pathCache: {
        "Waterfall.svg": "/fallbackImages/Waterfall.svg",
        "user1": "UploadData/PHOTO/16by16_30168.jpg",
        "Agile.svg": "/fallbackImages/Agile.svg",
        "user2": null,
        "user3": null,
        "Service.svg": "/fallbackImages/Service.svg"
    }
}));


describe('renderUserName', () => {
    test('should render user with cached image path', () => {

        const html = renderUserName({ id: 'user1', name: 'John Doe' });
        expect(html).toContain('img src="UploadData/PHOTO/16by16_30168.jpg"');
        expect(html).toContain('John Doe');
    });

    test('should render user with initials when no image path is available', () => {
        const html = renderUserName({ id: 'user2', name: 'Jane Doe' });
        expect(html).toContain('<div class="ftbl-user-placeholder ftbl-user-initials" title="Jane Doe">jd</div>');
    });

    test('should handle names with more than two words by using only first two initials', () => {
        const html = renderUserName({ id: 'user3', name: 'John Michael Doe' });
        expect(html).toContain('<div class="ftbl-user-placeholder ftbl-user-initials" title="John Michael Doe">jm</div>');
        expect(html).toContain('John Michael Doe');
    });


    test('should handle cases when image path is null', () => {
        const html = renderUserName({ id: 'user3', name: 'Alice Johnson' }); // Ensure this user ID actually maps to null in pathCache
        expect(html).toContain('<div class="ftbl-user-placeholder ftbl-user-initials" title="Alice Johnson">aj</div>');
        expect(html).toContain('Alice Johnson');
    });
});

describe('renderEntityName', () => {
    test('should render entity with subtype icon', () => {
        const html = renderEntityName({ entityType: 'project', entitySubType: 'waterfall', name: 'Project X' });
        expect(html).toContain('<img src="/fallbackImages/Waterfall.svg"');
        expect(html).toContain('Project X');
    });
    

    test('should render entity without subtype if subtype not in map and type exists', () => {
        const html = renderEntityName({ entityType: 'service', name: 'Our Service' });
        expect(html).toContain('<img src="/fallbackImages/Service.svg"');
        expect(html).toContain('Our Service');
    });
    test('should return empty string if entity type does not exist', () => {
        const html = renderEntityName({ entityType: 'non-existent', name: 'No Entity' });
        expect(html).toContain('<img src=""'); // No image path should be present
        expect(html).toContain('No Entity');
    });
    

    test('should render entity without subtype if subtype is undefined', () => {
        const html = renderEntityName({ entityType: 'service', name: 'Our Service' });
        expect(html).toContain('<img src="/fallbackImages/Service.svg"');
        expect(html).toContain('Our Service');
    });
});

describe('renderDuration', () => {
    test('should return formatted HH:MM for valid minutes', () => {
        const html = renderDuration({ value: 125 });
        expect(html).toBe('2:05');
    });

    test('should return empty string if minutes are invalid', () => {
        const html = renderDuration({ value: 'not a number' });
        expect(html).toBe('');
    });

    test('should return empty string if no value provided', () => {
        const html = renderDuration({});
        expect(html).toBe('');
    });
});
