// Get all supported timezones
const allTimezones = Intl.supportedValuesOf('timeZone');
let filteredTimezones = [...allTimezones];

// Populate dropdowns
function populateDropdowns() {
    const currentTimezone = document.getElementById('currentTimezone');
    const sourceZone = document.getElementById('sourceZone');
    const targetZone = document.getElementById('targetZone');

    [currentTimezone, sourceZone, targetZone].forEach(select => {
        select.innerHTML = '';
    });

    allTimezones.forEach(zone => {
        const option = new Option(zone.replace(/_/g, ' '), zone);
        currentTimezone.add(option.cloneNode(true));
        sourceZone.add(option.cloneNode(true));
        targetZone.add(option.cloneNode(true));
    });

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    currentTimezone.value = userTimezone;
    sourceZone.value = userTimezone;
    targetZone.value = 'UTC';

    updateCurrentTime();
}

// Update current time display
function updateCurrentTime() {
    const timezone = document.getElementById('currentTimezone').value;
    const now = new Date();
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeStyle: 'medium',
        hour12: true
    });
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        dateStyle: 'long'
    });

    document.getElementById('currentTime').textContent = timeFormatter.format(now);
    document.getElementById('currentDate').textContent = dateFormatter.format(now);
}

// Calculate time difference between zones
function calculateTimeDifference() {
    const sourceZone = document.getElementById('sourceZone').value;
    const targetZone = document.getElementById('targetZone').value;
    const now = new Date();

    const sourceTime = new Intl.DateTimeFormat('en-US', {
        timeZone: sourceZone,
        timeStyle: 'medium',
        dateStyle: 'short'
    }).format(now);

    const targetTime = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        timeStyle: 'medium',
        dateStyle: 'short'
    }).format(now);

    const sourceOffset = getTimezoneOffset(sourceZone);
    const targetOffset = getTimezoneOffset(targetZone);
    const difference = targetOffset - sourceOffset;

    const hours = Math.floor(Math.abs(difference) / 60);
    const minutes = Math.abs(difference) % 60;
    
    let differenceText = '';
    if (difference === 0) {
        differenceText = 'Both timezones are the same';
    } else if (difference > 0) {
        differenceText = `${targetZone.replace(/_/g, ' ')} is ${hours}h ${minutes}m ahead of ${sourceZone.replace(/_/g, ' ')}`;
    } else {
        differenceText = `${targetZone.replace(/_/g, ' ')} is ${hours}h ${minutes}m behind ${sourceZone.replace(/_/g, ' ')}`;
    }

    document.getElementById('timeDifference').textContent = differenceText;
    document.getElementById('timezoneComparison').innerHTML = `
        <strong>${sourceZone.replace(/_/g, ' ')}:</strong> ${sourceTime}<br>
        <strong>${targetZone.replace(/_/g, ' ')}:</strong> ${targetTime}
    `;
    document.getElementById('timeDifferenceResult').style.display = 'block';
}

// Get timezone offset in minutes
function getTimezoneOffset(timezone) {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const local = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (local.getTime() - utc.getTime()) / 60000;
}

// Display filtered timezones
function displayFilteredTimezones() {
    const container = document.getElementById('allTimezones');
    const searchPrompt = document.getElementById('searchPrompt');
    
    container.innerHTML = '';
    
    if (filteredTimezones.length === 0) {
        searchPrompt.textContent = 'No timezones found matching your search';
        searchPrompt.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    filteredTimezones.forEach(zone => {
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeStyle: 'medium',
            dateStyle: 'short'
        });

        const card = document.createElement('div');
        card.className = 'timezone-card';
        card.innerHTML = `
            <div class="timezone-name">${zone.replace(/_/g, ' ')}</div>
            <div class="timezone-time">${timeFormatter.format(now)}</div>
        `;
        container.appendChild(card);
    });

    searchPrompt.style.display = 'none';
    container.style.display = 'grid';
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('timezoneSearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            document.getElementById('allTimezones').style.display = 'none';
            document.getElementById('searchPrompt').style.display = 'block';
            document.getElementById('searchPrompt').textContent = 'Start typing to search and view timezones';
            return;
        }
        
        filteredTimezones = allTimezones.filter(zone => 
            zone.toLowerCase().includes(searchTerm)
        );
        
        displayFilteredTimezones();
    });
}

// Initialize the application
function init() {
    console.log('All IANA Time Zones:', allTimezones);

    const currentTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        timeStyle: 'medium',
        dateStyle: 'long'
    }).format(new Date());
    console.log('Current time in Asia/Kolkata:', currentTime);

    allTimezones.forEach(zone => {
        const time = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeStyle: 'medium',
            dateStyle: 'short'
        }).format(new Date());
        console.log(zone, '→', time);
    });

    populateDropdowns();
    setupSearch();

    setInterval(updateCurrentTime, 1000);
}

// Event listeners
document.getElementById('currentTimezone').addEventListener('change', updateCurrentTime);

// Initialize when page loads
window.addEventListener('load', init);
