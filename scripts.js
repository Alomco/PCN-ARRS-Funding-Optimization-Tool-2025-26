// DOM Elements
const regionSelect = document.getElementById('region');
const pcnDisplayInput = document.getElementById('pcn-display');
const pcnNameHidden = document.getElementById('pcn-name-hidden');
const pcnCodeInput = document.getElementById('pcn-code');
const rawListSizeInput = document.getElementById('raw-list-size');
const adjustedPopulationInput = document.getElementById('adjusted-population');
const maxArrsAllocationInput = document.getElementById('max-arrs-allocation');
const londonWeightingCheckbox = document.getElementById('london-weighting');
const rolesTableBody = document.querySelector('#roles-table tbody');
const totalCostElement = document.getElementById('total-cost');
const totalReimbursementElement = document.getElementById('total-reimbursement');
const remainingBudgetElement = document.getElementById('remaining-budget');
const optimizationStrategySelect = document.getElementById('optimization-strategy');
const customPrioritiesContainer = document.getElementById('custom-priorities');
const prioritiesContainer = document.querySelector('.priorities-container');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const resultsContainer = document.getElementById('results-container');
const totalFundingSpan = document.getElementById('total-funding');
const unusedFundingSpan = document.getElementById('unused-funding');
const percentageUsedSpan = document.getElementById('percentage-used');
const roleBreakdownTable = document.getElementById('role-breakdown').querySelector('tbody');
const optimizationSuggestions = document.getElementById('optimization-suggestions');
const fundingChart = document.getElementById('funding-chart');
const pcnModal = document.getElementById('pcn-modal');
const pcnModalSearch = document.getElementById('pcn-modal-search');
const pcnList = document.getElementById('pcn-list');
const icbNameSelect = document.getElementById('icb-name');
const exportPdfBtn = document.getElementById('export-pdf');
const exportCsvBtn = document.getElementById('export-csv');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Constants for ARRS Funding 2025/26
const ARRS_FUNDING = {
    BASE_ALLOCATION_PER_WEIGHTED_PATIENT: 26.631, // £ per weighted patient
    LONDON_WEIGHTING_FACTOR: 0.20, // 20% increase for London
    TOTAL_NATIONAL_FUNDING: 1697000000, // £1.697 billion for 2025/26
};

// Reimbursable Roles with 2025/26 salary information
const REIMBURSABLE_ROLES = [
    {
        id: 'gp',
        title: 'GP',
        baseSalary: 82418,
        onCostsFactor: 0.25, // Employer on-costs as percentage
        maxReimbursement: 1.0, // 100% reimbursement
        restrictions: 'Within 2 years of CCT date, not previously employed as GP',
        clinicalPriority: 10, // 1-10 scale for optimization
        category: 'clinical'
    },
    {
        id: 'enhanced_practice_nurse',
        title: 'Enhanced Practice Nurse',
        baseSalary: 64907,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: 'Not held post within PCN in last 12 months',
        clinicalPriority: 9,
        category: 'clinical'
    },
    {
        id: 'new_practice_nurse',
        title: 'New to General Practice Nurse',
        baseSalary: 45000, // Estimated based on typical band 6 nurse salary
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: 'Not held post within PCN in last 12 months',
        clinicalPriority: 8,
        category: 'clinical'
    },
    {
        id: 'clinical_pharmacist',
        title: 'Clinical Pharmacist',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 8,
        category: 'clinical'
    },
    {
        id: 'pharmacy_technician',
        title: 'Pharmacy Technician',
        baseSalary: 35389,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 6,
        category: 'clinical'
    },
    {
        id: 'social_prescriber',
        title: 'Social Prescribing Link Worker',
        baseSalary: 35389,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 5,
        category: 'non-clinical'
    },
    {
        id: 'health_coach',
        title: 'Health and Wellbeing Coach',
        baseSalary: 35389,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 5,
        category: 'non-clinical'
    },
    {
        id: 'care_coordinator',
        title: 'Care Coordinator',
        baseSalary: 29018,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 4,
        category: 'non-clinical'
    },
    {
        id: 'physician_associate',
        title: 'Physician Associate',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 9,
        category: 'clinical'
    },
    {
        id: 'first_contact_physio',
        title: 'First Contact Physiotherapist',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 8,
        category: 'clinical'
    },
    {
        id: 'dietitian',
        title: 'Dietitian',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 7,
        category: 'clinical'
    },
    {
        id: 'podiatrist',
        title: 'Podiatrist',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 7,
        category: 'clinical'
    },
    {
        id: 'occupational_therapist',
        title: 'Occupational Therapist',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 7,
        category: 'clinical'
    },
    {
        id: 'mental_health_practitioner',
        title: 'Mental Health Practitioner',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 8,
        category: 'clinical'
    },
    {
        id: 'paramedic',
        title: 'Community Paramedic',
        baseSalary: 55670,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 9,
        category: 'clinical'
    },
    {
        id: 'advanced_practitioner',
        title: 'Advanced Practitioner',
        baseSalary: 65000,
        onCostsFactor: 0.25,
        maxReimbursement: 1.0,
        restrictions: '',
        clinicalPriority: 10,
        category: 'clinical'
    }
];

let pcnData = [];
let pieChart = null;
let selectedRoles = [];

document.addEventListener('DOMContentLoaded', function() {
    try {
        loadPcnDataFromCsv();
        setupEventListeners();
        populateRolesTable();
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to initialize the calculator. Please check the console for details.');
    }
});

async function loadPcnDataFromCsv() {
    try {
        loadingSpinner.style.display = 'block';
        const response = await fetch('./data/pcn_data.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        const csvText = await response.text();
        if (!csvText.trim()) {
            throw new Error('CSV file is empty');
        }
        pcnData = parseCsvData(csvText);
        if (pcnData.length === 0) {
            throw new Error('No valid PCN data parsed from CSV');
        }
        console.log('PCN Data Loaded:', pcnData);
        populateRegions();
        populateIcbNames();
    } catch (error) {
        console.error('Error loading PCN data:', error);
        alert(`Failed to load PCN data: ${error.message}. Please check the console for details and ensure the CSV file is available.`);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function parseCsvData(csvText) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '');
    const headers = lines[0].split(',').map(h => h.replace(/^\uFEFF/, '').trim());

    // find the columns
    const practiceCodeIndex = headers.findIndex(h => h === 'Practice Code');
    const practiceNameIndex = headers.findIndex(h => h === 'Practice Name');
    const pcnCodeIndex = headers.findIndex(h => h === 'PCN Code');
    const pcnNameIndex = headers.findIndex(h => h === 'PCN Name');
    const icbNameIndex = headers.findIndex(h => h === 'ICB Name');
    const regionIndex = headers.findIndex(h => h === 'Region');
    const rawIndex = headers.findIndex(h => h === 'Raw list size');
    const adjIndex = headers.findIndex(h => h === 'Adjusted Population');

    // abort if any required column is missing
    const missing = [];
    if (practiceCodeIndex < 0) missing.push('Practice Code');
    if (practiceNameIndex < 0) missing.push('Practice Name');
    if (pcnCodeIndex < 0) missing.push('PCN Code');
    if (pcnNameIndex < 0) missing.push('PCN Name');
    if (icbNameIndex < 0) missing.push('ICB Name');
    if (regionIndex < 0) missing.push('Region');
    if (rawIndex < 0) missing.push('Raw list size');
    if (adjIndex < 0) missing.push('Adjusted Population');
    if (missing.length) {
        console.error('Missing required CSV columns:', missing);
        alert('Error: Missing required columns:\n' + missing.join(', '));
        return [];
    }

    const pcns = [];
    const pcnMap = new Map();

    // iterate rows
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length <= rawIndex) continue;

        // 1) pull out your key identifiers first
        const pcnCode = values[pcnCodeIndex]?.trim() || '';
        const pcnName = values[pcnNameIndex]?.trim() || '';
        const icbName = values[icbNameIndex]?.trim() || '';
        const region = values[regionIndex]?.trim() || '';
        // skip rows without a valid PCN
        if (!pcnCode || !pcnName) continue;

        // 2) initialize the PCN entry once
        if (!pcnMap.has(pcnCode)) {
            pcnMap.set(pcnCode, { pcnCode, pcnName, icbName, region, practices: [] });
            pcns.push(pcnMap.get(pcnCode));
        }

        // 3) now parse the practice‐level fields
        const practiceCode = values[practiceCodeIndex]?.trim() || '';
        const practiceName = values[practiceNameIndex]?.trim() || '';
        const raw2025 = parseFloat(values[rawIndex]) || 0;
        const adjPop = parseFloat(values[adjIndex]) || 0;

        // 4) add this practice
        const practice = {
            practiceCode,
            practiceName,
            raw: raw2025,
            adjustedPopulation: adjPop
        };
        pcnMap.get(pcnCode).practices.push(practice);
    }

    return pcns;
}

function populateRegions() {
    const allowedRegions = [
        "East of England",
        "London",
        "Midlands",
        "North East and Yorkshire",
        "North West",
        "South East",
        "South West"
    ];
    while (regionSelect.options.length > 1) {
        regionSelect.remove(1);
    }
    allowedRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

function populateIcbNames() {
    const select = document.getElementById('icb-name');

    // 1) Clear any existing options (keep the first "All ICBs..." one)
    while (select.options.length > 1) {
        select.remove(1);
    }

    // 2) Only these approved ICBs:
    const allowedIcbNames = [
        "NHS Bedfordshire, Luton and Milton Keynes Integrated Care Board",
        "NHS Cambridgeshire and Peterborough Integrated Care Board",
        "NHS Hertfordshire and West Essex Integrated Care Board",
        "NHS Mid and South Essex Integrated Care Board",
        "NHS Norfolk and Waveney Integrated Care Board",
        "NHS Suffolk and North East Essex Integrated Care Board",
        "NHS North Central London Integrated Care Board",
        "NHS North East London Integrated Care Board",
        "NHS North West London Integrated Care Board",
        "NHS South East London Integrated Care Board",
        "NHS South West London Integrated Care Board",
        "NHS Birmingham and Solihull Integrated Care Board",
        "NHS Black Country Integrated Care Board",
        "NHS Coventry and Warwickshire Integrated Care Board",
        "NHS Derby and Derbyshire Integrated Care Board",
        "NHS Herefordshire and Worcestershire Integrated Care Board",
        "NHS Leicester, Leicestershire and Rutland Integrated Care Board",
        "NHS Lincolnshire Integrated Care Board",
        "NHS Northamptonshire Integrated Care Board",
        "NHS Nottingham and Nottinghamshire Integrated Care Board",
        "NHS Shropshire, Telford and Wrekin Integrated Care Board",
        "NHS Staffordshire and Stoke-on-Trent Integrated Care Board",
        "NHS Humber and North Yorkshire Integrated Care Board",
        "NHS North East and North Cumbria Integrated Care Board",
        "NHS South Yorkshire Integrated Care Board",
        "NHS West Yorkshire Integrated Care Board",
        "NHS Cheshire and Merseyside Integrated Care Board",
        "NHS Greater Manchester Integrated Care Board",
        "NHS Lancashire and South Cumbria Integrated Care Board",
        "NHS Buckinghamshire, Oxfordshire and Berkshire West Integrated Care Board",
        "NHS Frimley Integrated Care Board",
        "NHS Hampshire and Isle of Wight Integrated Care Board",
        "NHS Kent and Medway Integrated Care Board",
        "NHS Surrey Heartlands ICB",
        "NHS Sussex ICB",
        "NHS Bath and North East Somerset, Swindon and Wiltshire Integrated Care Board",
        "NHS Bristol, North Somerset and South Gloucestershire Integrated Care Board",
        "NHS Cornwall and the Isles of Scilly Integrated Care Board",
        "NHS Devon Integrated Care Board",
        "NHS Dorset Integrated Care Board",
        "NHS Gloucestershire Integrated Care Board",
        "NHS Somerset Integrated Care Board"
    ];

    // 3) Which region (if any) is selected?
    const selectedRegion = regionSelect.value;

    // 4) Build a Set of ICBs that:
    //    • appear in pcnData
    //    • match the selected region (or all if none selected)
    //    • are in your allowedIcbNames list
    const icbSet = new Set();
    pcnData.forEach(pcn => {
        if (
            allowedIcbNames.includes(pcn.icbName) &&
            (!selectedRegion || pcn.region === selectedRegion)
        ) {
            icbSet.add(pcn.icbName);
        }
    });

    // 5) Sort and append
    Array.from(icbSet)
        .sort((a, b) => a.localeCompare(b))
        .forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
}

function populateRolesTable() {
    rolesTableBody.innerHTML = '';
    
    REIMBURSABLE_ROLES.forEach(role => {
        const row = document.createElement('tr');
        row.dataset.roleId = role.id;
        
        // Role name
        const nameCell = document.createElement('td');
        nameCell.textContent = role.title;
        row.appendChild(nameCell);
        
        // Include checkbox
        const includeCell = document.createElement('td');
        const includeCheckbox = document.createElement('input');
        includeCheckbox.type = 'checkbox';
        includeCheckbox.id = `include-${role.id}`;
        includeCheckbox.classList.add('role-include');
        includeCheckbox.addEventListener('change', updateCalculations);
        includeCell.appendChild(includeCheckbox);
        row.appendChild(includeCell);
        
        // FTE input
        const fteCell = document.createElement('td');
        const fteInput = document.createElement('input');
        fteInput.type = 'number';
        fteInput.id = `fte-${role.id}`;
        fteInput.classList.add('role-fte');
        fteInput.min = '0';
        fteInput.step = '0.1';
        fteInput.value = '0';
        fteInput.disabled = true;
        fteInput.addEventListener('input', updateCalculations);
        fteCell.appendChild(fteInput);
        row.appendChild(fteCell);
        
        // Salary cost
        const salaryCell = document.createElement('td');
        salaryCell.id = `salary-${role.id}`;
        salaryCell.textContent = formatCurrency(role.baseSalary);
        row.appendChild(salaryCell);
        
        // Total cost
        const totalCostCell = document.createElement('td');
        totalCostCell.id = `total-cost-${role.id}`;
        totalCostCell.textContent = '£0.00';
        row.appendChild(totalCostCell);
        
        // Reimbursement
        const reimbursementCell = document.createElement('td');
        reimbursementCell.id = `reimbursement-${role.id}`;
        reimbursementCell.textContent = '£0.00';
        row.appendChild(reimbursementCell);
        
        // Notes
        const notesCell = document.createElement('td');
        notesCell.textContent = role.restrictions || 'No restrictions';
        row.appendChild(notesCell);
        
        rolesTableBody.appendChild(row);
        
        // Add event listener to enable/disable FTE input based on checkbox
        includeCheckbox.addEventListener('change', function() {
            fteInput.disabled = !this.checked;
            if (this.checked && fteInput.value === '0') {
                fteInput.value = '1';
            }
            updateCalculations();
        });
    });
    
    // Populate custom priorities container
    populateCustomPriorities();
}

function populateCustomPriorities() {
    prioritiesContainer.innerHTML = '';
    
    REIMBURSABLE_ROLES.forEach(role => {
        const priorityDiv = document.createElement('div');
        priorityDiv.classList.add('priority-item');
        
        const label = document.createElement('label');
        label.htmlFor = `priority-${role.id}`;
        label.textContent = role.title;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `priority-${role.id}`;
        input.min = '1';
        input.max = '10';
        input.value = role.clinicalPriority;
        
        priorityDiv.appendChild(label);
        priorityDiv.appendChild(input);
        prioritiesContainer.appendChild(priorityDiv);
    });
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    regionSelect.addEventListener('change', () => {
        pcnDisplayInput.value = '';
        pcnNameHidden.value = '';
        pcnCodeInput.value = '';
        populateIcbNames();
    });

    icbNameSelect.addEventListener('change', () => {
        populateIcbNames();
    });

    pcnDisplayInput.addEventListener('click', openPcnModal);
    
    calculateBtn.addEventListener('click', calculateFunding);
    
    resetBtn.addEventListener('click', resetData);
    
    optimizationStrategySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customPrioritiesContainer.style.display = 'block';
        } else {
            customPrioritiesContainer.style.display = 'none';
        }
    });
    
    londonWeightingCheckbox.addEventListener('change', updateCalculations);
    
    adjustedPopulationInput.addEventListener('input', updateMaxARRSAllocation);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    exportPdfBtn.addEventListener('click', exportToPdf);
    exportCsvBtn.addEventListener('click', exportToCsv);
}

function openPcnModal() {
    pcnList.innerHTML = '';
    
    const selectedRegion = regionSelect.value;
    const selectedIcb = icbNameSelect.value;
    
    let filteredPcns = pcnData;
    
    if (selectedRegion) {
        filteredPcns = filteredPcns.filter(pcn => pcn.region === selectedRegion);
    }
    
    if (selectedIcb) {
        filteredPcns = filteredPcns.filter(pcn => pcn.icbName === selectedIcb);
    }
    
    filteredPcns.forEach(pcn => {
        const pcnItem = document.createElement('div');
        pcnItem.classList.add('pcn-item');
        pcnItem.textContent = `${pcn.pcnName} (${pcn.pcnCode})`;
        pcnItem.dataset.pcnCode = pcn.pcnCode;
        pcnItem.dataset.pcnName = pcn.pcnName;
        
        pcnItem.addEventListener('click', function() {
            const allItems = pcnList.querySelectorAll('.pcn-item');
            allItems.forEach(item => item.classList.remove('selected'));
            this.classList.add('selected');
        });
        
        pcnList.appendChild(pcnItem);
    });
    
    pcnModal.style.display = 'block';
    
    // Close modal when clicking on X
    const closeBtn = pcnModal.querySelector('.close');
    closeBtn.onclick = function() {
        pcnModal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === pcnModal) {
            pcnModal.style.display = 'none';
        }
    };
    
    // Select PCN button
    const selectPcnBtn = document.getElementById('select-pcn-btn');
    selectPcnBtn.onclick = function() {
        const selectedItem = pcnList.querySelector('.pcn-item.selected');
        if (selectedItem) {
            pcnDisplayInput.value = selectedItem.dataset.pcnName;
            pcnNameHidden.value = selectedItem.dataset.pcnName;
            pcnCodeInput.value = selectedItem.dataset.pcnCode;
            
            // Populate population data if available
            const selectedPcn = pcnData.find(pcn => pcn.pcnCode === selectedItem.dataset.pcnCode);
            if (selectedPcn) {
                let totalRaw = 0;
                let totalAdjusted = 0;
                
                selectedPcn.practices.forEach(practice => {
                    totalRaw += practice.raw || 0;
                    totalAdjusted += practice.adjustedPopulation || 0;
                });
                
                rawListSizeInput.value = Math.round(totalRaw);
                adjustedPopulationInput.value = Math.round(totalAdjusted);
                
                // Update max ARRS allocation
                updateMaxARRSAllocation();
            }
        }
        pcnModal.style.display = 'none';
    };
    
    // Filter PCNs when searching
    pcnModalSearch.oninput = function() {
        const searchTerm = this.value.toLowerCase();
        const items = pcnList.querySelectorAll('.pcn-item');
        
        items.forEach(item => {
            const pcnName = item.dataset.pcnName.toLowerCase();
            const pcnCode = item.dataset.pcnCode.toLowerCase();
            
            if (pcnName.includes(searchTerm) || pcnCode.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };
}

function updateMaxARRSAllocation() {
    const weightedPopulation = parseFloat(adjustedPopulationInput.value) || 0;
    const maxAllocation = calculateMaxARRSFunding(weightedPopulation);
    maxArrsAllocationInput.value = formatCurrency(maxAllocation);
    
    // Update remaining budget
    updateCalculations();
}

function calculateMaxARRSFunding(weightedPopulation) {
    return weightedPopulation * ARRS_FUNDING.BASE_ALLOCATION_PER_WEIGHTED_PATIENT;
}

function updateCalculations() {
    const isLondon = londonWeightingCheckbox.checked;
    let totalCost = 0;
    let totalReimbursement = 0;
    
    selectedRoles = [];
    
    REIMBURSABLE_ROLES.forEach(role => {
        const includeCheckbox = document.getElementById(`include-${role.id}`);
        const fteInput = document.getElementById(`fte-${role.id}`);
        const salaryCell = document.getElementById(`salary-${role.id}`);
        const totalCostCell = document.getElementById(`total-cost-${role.id}`);
        const reimbursementCell = document.getElementById(`reimbursement-${role.id}`);
        
        if (includeCheckbox.checked) {
            const fte = parseFloat(fteInput.value) || 0;
            
            // Apply London weighting if applicable
            let adjustedSalary = role.baseSalary;
            if (isLondon) {
                adjustedSalary *= (1 + ARRS_FUNDING.LONDON_WEIGHTING_FACTOR);
            }
            
            // Update salary display
            salaryCell.textContent = formatCurrency(adjustedSalary);
            
            // Calculate total cost including on-costs
            const roleCost = calculateRoleCost(role, fte, isLondon);
            totalCostCell.textContent = formatCurrency(roleCost);
            
            // Calculate reimbursement
            const reimbursement = roleCost * role.maxReimbursement;
            reimbursementCell.textContent = formatCurrency(reimbursement);
            
            // Add to totals
            totalCost += roleCost;
            totalReimbursement += reimbursement;
            
            // Add to selected roles
            selectedRoles.push({
                ...role,
                fte,
                adjustedSalary,
                totalCost: roleCost,
                reimbursement
            });
        } else {
            // Reset cells if not included
            totalCostCell.textContent = '£0.00';
            reimbursementCell.textContent = '£0.00';
        }
    });
    
    // Update totals
    totalCostElement.textContent = formatCurrency(totalCost);
    totalReimbursementElement.textContent = formatCurrency(totalReimbursement);
    
    // Update remaining budget
    const maxAllocation = parseFloat(maxArrsAllocationInput.value.replace(/[£,]/g, '')) || 0;
    const remainingBudget = maxAllocation - totalReimbursement;
    remainingBudgetElement.textContent = formatCurrency(remainingBudget);
    
    // Highlight if over budget
    if (remainingBudget < 0) {
        remainingBudgetElement.classList.add('over-budget');
    } else {
        remainingBudgetElement.classList.remove('over-budget');
    }
}

function calculateRoleCost(role, fte, isLondon) {
    let baseSalary = role.baseSalary;
    
    // Apply London weighting if applicable
    if (isLondon) {
        baseSalary *= (1 + ARRS_FUNDING.LONDON_WEIGHTING_FACTOR);
    }
    
    // Calculate total cost including on-costs
    const totalCost = baseSalary * (1 + role.onCostsFactor) * fte;
    
    return totalCost;
}

function calculateFunding() {
    if (!validateInputs()) {
        return;
    }
    
    loadingSpinner.style.display = 'block';
    
    // Short timeout to allow spinner to render
    setTimeout(() => {
        try {
            const weightedPopulation = parseFloat(adjustedPopulationInput.value) || 0;
            const maxAllocation = calculateMaxARRSFunding(weightedPopulation);
            const isLondon = londonWeightingCheckbox.checked;
            
            // Calculate total reimbursement
            const totalReimbursement = selectedRoles.reduce((sum, role) => sum + role.reimbursement, 0);
            
            // Calculate unused funding
            const unusedFunding = maxAllocation - totalReimbursement;
            const percentageUsed = maxAllocation > 0 ? (totalReimbursement / maxAllocation) * 100 : 0;
            
            // Update results summary
            totalFundingSpan.textContent = formatCurrency(totalReimbursement);
            unusedFundingSpan.textContent = formatCurrency(unusedFunding);
            percentageUsedSpan.textContent = `${percentageUsed.toFixed(1)}%`;
            
            // Generate role breakdown
            generateRoleBreakdown();
            
            // Generate optimization suggestions
            generateOptimizationSuggestions(maxAllocation, unusedFunding);
            
            // Create funding chart
            createFundingChart();
            
            // Show results
            resultsContainer.style.display = 'block';
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error calculating funding:', error);
            alert('An error occurred while calculating funding. Please check your inputs and try again.');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }, 500);
}

function validateInputs() {
    // Check if PCN is selected
    if (!pcnCodeInput.value) {
        alert('Please select a PCN before calculating funding.');
        return false;
    }
    
    // Check if population data is entered
    if (!adjustedPopulationInput.value) {
        alert('Please enter the adjusted/weighted population for your PCN.');
        return false;
    }
    
    // Check if at least one role is selected
    const anyRoleSelected = REIMBURSABLE_ROLES.some(role => 
        document.getElementById(`include-${role.id}`).checked
    );
    
    if (!anyRoleSelected) {
        alert('Please select at least one role to include in the calculation.');
        return false;
    }
    
    return true;
}

function generateRoleBreakdown() {
    roleBreakdownTable.innerHTML = '';
    
    selectedRoles.forEach(role => {
        const row = document.createElement('tr');
        
        // Role name
        const nameCell = document.createElement('td');
        nameCell.textContent = role.title;
        row.appendChild(nameCell);
        
        // FTE
        const fteCell = document.createElement('td');
        fteCell.textContent = role.fte.toFixed(1);
        row.appendChild(fteCell);
        
        // Salary cost
        const salaryCell = document.createElement('td');
        salaryCell.textContent = formatCurrency(role.adjustedSalary);
        row.appendChild(salaryCell);
        
        // On-costs
        const onCostsCell = document.createElement('td');
        const onCosts = role.adjustedSalary * role.onCostsFactor * role.fte;
        onCostsCell.textContent = formatCurrency(onCosts);
        row.appendChild(onCostsCell);
        
        // Total cost
        const totalCostCell = document.createElement('td');
        totalCostCell.textContent = formatCurrency(role.totalCost);
        row.appendChild(totalCostCell);
        
        // Reimbursement
        const reimbursementCell = document.createElement('td');
        reimbursementCell.textContent = formatCurrency(role.reimbursement);
        row.appendChild(reimbursementCell);
        
        roleBreakdownTable.appendChild(row);
    });
}

function generateOptimizationSuggestions(maxAllocation, unusedFunding) {
    optimizationSuggestions.innerHTML = '';
    
    const strategy = optimizationStrategySelect.value;
    
    if (unusedFunding <= 0) {
        // Over budget or exactly at budget
        const message = document.createElement('p');
        message.textContent = 'Your current selection is using 100% of your ARRS allocation. No further optimization is needed.';
        optimizationSuggestions.appendChild(message);
        return;
    }
    
    // Get suggested roles based on strategy
    const suggestedRoles = optimizeRoleMix(strategy, unusedFunding);
    
    if (suggestedRoles.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No optimization suggestions available. Your remaining budget is too small to add any additional roles.';
        optimizationSuggestions.appendChild(message);
        return;
    }
    
    // Create suggestions header
    const header = document.createElement('p');
    header.innerHTML = `<strong>Based on your selected optimization strategy (${getStrategyName(strategy)}), you could add:</strong>`;
    optimizationSuggestions.appendChild(header);
    
    // Create suggestions list
    const list = document.createElement('ul');
    
    suggestedRoles.forEach(suggestion => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${suggestion.fte.toFixed(1)} FTE ${suggestion.role.title}</strong> - Cost: ${formatCurrency(suggestion.cost)}`;
        list.appendChild(item);
    });
    
    optimizationSuggestions.appendChild(list);
    
    // Add note about restrictions
    const note = document.createElement('p');
    note.classList.add('info-note');
    note.textContent = 'Note: Please check role restrictions before adding suggested roles. Some roles may have eligibility criteria that must be met.';
    optimizationSuggestions.appendChild(note);
}

function getStrategyName(strategy) {
    switch (strategy) {
        case 'maximize-roles':
            return 'Maximize Number of Roles';
        case 'clinical-priority':
            return 'Prioritize Clinical Roles';
        case 'balanced':
            return 'Balanced Approach';
        case 'custom':
            return 'Custom Prioritization';
        default:
            return strategy;
    }
}

function optimizeRoleMix(strategy, remainingBudget) {
    const isLondon = londonWeightingCheckbox.checked;
    const suggestions = [];
    
    // Get all roles that aren't already selected or are selected but could have more FTE
    const availableRoles = REIMBURSABLE_ROLES.filter(role => {
        const selectedRole = selectedRoles.find(sr => sr.id === role.id);
        return !selectedRole || selectedRole.fte < 5; // Assuming max 5 FTE per role
    });
    
    if (availableRoles.length === 0) {
        return suggestions;
    }
    
    // Sort roles based on strategy
    let prioritizedRoles;
    
    switch (strategy) {
        case 'maximize-roles':
            // Sort by cost (ascending)
            prioritizedRoles = [...availableRoles].sort((a, b) => {
                const costA = calculateRoleCost(a, 1, isLondon);
                const costB = calculateRoleCost(b, 1, isLondon);
                return costA - costB;
            });
            break;
            
        case 'clinical-priority':
            // Sort by clinical priority (descending) and then by cost (ascending)
            prioritizedRoles = [...availableRoles].sort((a, b) => {
                if (b.clinicalPriority !== a.clinicalPriority) {
                    return b.clinicalPriority - a.clinicalPriority;
                }
                const costA = calculateRoleCost(a, 1, isLondon);
                const costB = calculateRoleCost(b, 1, isLondon);
                return costA - costB;
            });
            break;
            
        case 'balanced':
            // Sort by category (clinical first) and then by cost (ascending)
            prioritizedRoles = [...availableRoles].sort((a, b) => {
                if (a.category !== b.category) {
                    return a.category === 'clinical' ? -1 : 1;
                }
                const costA = calculateRoleCost(a, 1, isLondon);
                const costB = calculateRoleCost(b, 1, isLondon);
                return costA - costB;
            });
            break;
            
        case 'custom':
            // Sort by custom priorities (descending)
            prioritizedRoles = [...availableRoles].sort((a, b) => {
                const priorityA = parseInt(document.getElementById(`priority-${a.id}`).value) || 1;
                const priorityB = parseInt(document.getElementById(`priority-${b.id}`).value) || 1;
                return priorityB - priorityA;
            });
            break;
            
        default:
            prioritizedRoles = availableRoles;
    }
    
    // Find roles that fit within remaining budget
    for (const role of prioritizedRoles) {
        const costPerFTE = calculateRoleCost(role, 1, isLondon);
        
        if (costPerFTE <= remainingBudget) {
            // Calculate max FTE that fits in budget
            const maxFTE = Math.floor(remainingBudget / costPerFTE * 10) / 10; // Round to 1 decimal
            const suggestedFTE = Math.min(maxFTE, 1); // Suggest at most 1 FTE initially
            
            suggestions.push({
                role,
                fte: suggestedFTE,
                cost: costPerFTE * suggestedFTE
            });
            
            // Only suggest one role at a time
            break;
        }
    }
    
    return suggestions;
}

function createFundingChart() {
    const ctx = fundingChart.getContext('2d');
    
    // Destroy existing chart if it exists
    if (pieChart) {
        pieChart.destroy();
    }
    
    // Group roles by category
    const roleCategories = {};
    let totalFunding = 0;
    
    selectedRoles.forEach(role => {
        const category = role.category || 'Other';
        if (!roleCategories[category]) {
            roleCategories[category] = 0;
        }
        roleCategories[category] += role.reimbursement;
        totalFunding += role.reimbursement;
    });
    
    // Add unused funding if any
    const maxAllocation = parseFloat(maxArrsAllocationInput.value.replace(/[£,]/g, '')) || 0;
    const unusedFunding = Math.max(0, maxAllocation - totalFunding);
    
    if (unusedFunding > 0) {
        roleCategories['Unused Funding'] = unusedFunding;
    }
    
    // Prepare data for chart
    const labels = Object.keys(roleCategories);
    const data = Object.values(roleCategories);
    
    // Define colors
    const colors = [
        '#005eb8', // NHS Blue
        '#41b6e6', // NHS Light Blue
        '#330072', // NHS Purple
        '#ae2573', // NHS Pink
        '#78be20', // NHS Light Green
        '#00a499', // NHS Aqua Green
        '#ffb81c', // NHS Warm Yellow
        '#d5281b', // NHS Red
        '#768692'  // NHS Grey
    ];
    
    // Create chart
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Frutiger W01', Arial, sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / maxAllocation) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function exportToPdf() {
    if (!validateResults()) {
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Constants for layout
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - 2 * margin;
        const fontRegular = 'Helvetica';
        const fontBold = 'Helvetica-Bold';
        const primaryColor = '#005eb8'; // NHS Blue
        const secondaryColor = '#003087'; // Darker Blue
        
        // Helper functions
        function addHeader(pageNumber) {
            doc.setFillColor(primaryColor);
            doc.rect(0, 0, pageWidth, 15, 'F');
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text(`PCN ARRS Funding Optimization Tool 2025/26 - ${pcnNameHidden.value || 'Unnamed PCN'}`, margin, 10);
            doc.text(`Page ${pageNumber}`, pageWidth - margin - 10, 10, { align: 'right' });
        }
        
        function addFooter() {
            doc.setFillColor(secondaryColor);
            doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text(
                `Powered by www.pcnd.info | Generated on ${new Date().toLocaleDateString('en-GB')}`,
                margin,
                pageHeight - 3
            );
        }
        
        function addSectionTitle(title, y) {
            doc.setFont(fontBold, 'normal');
            doc.setFontSize(16);
            doc.setTextColor(secondaryColor);
            doc.text(title, margin, y);
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.5);
            doc.line(margin, y + 2, margin + contentWidth, y + 2);
            return y + 10;
        }
        
        // Cover Page
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setFont(fontBold, 'normal');
        doc.setFontSize(28);
        doc.setTextColor(primaryColor);
        doc.text('PCN ARRS Funding Report', pageWidth / 2, 80, { align: 'center' });
        doc.setFontSize(20);
        doc.text(pcnNameHidden.value || 'Unnamed PCN', pageWidth / 2, 100, { align: 'center' });
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(14);
        doc.text(`Fiscal Year 2025/26`, pageWidth / 2, 120, { align: 'center' });
        doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 130, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text('Powered by www.pcnd.info', pageWidth / 2, pageHeight - 25, { align: 'center' });
        
        // Page 2: PCN Information and Funding Summary
        doc.addPage();
        let currentPage = 2;
        let yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // PCN Information
        yPosition = addSectionTitle('PCN Information', yPosition);
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`PCN Name: ${pcnNameHidden.value || 'Unnamed PCN'}`, margin, yPosition + 10);
        doc.text(`PCN Code: ${pcnCodeInput.value || 'N/A'}`, margin, yPosition + 20);
        doc.text(`Raw List Size: ${rawListSizeInput.value || '0'}`, margin, yPosition + 30);
        doc.text(`Adjusted Population: ${adjustedPopulationInput.value || '0'}`, margin, yPosition + 40);
        doc.text(`London Weighting Applied: ${londonWeightingCheckbox.checked ? 'Yes' : 'No'}`, margin, yPosition + 50);
        yPosition += 60;
        
        // Funding Summary
        yPosition = addSectionTitle('Funding Summary', yPosition);
        doc.setFont(fontBold, 'normal');
        doc.setFontSize(12);
        doc.text(`Maximum ARRS Allocation: ${maxArrsAllocationInput.value || '£0.00'}`, margin, yPosition + 10);
        doc.text(`Total ARRS Funding Claimed: ${totalFundingSpan.textContent || '£0.00'}`, margin, yPosition + 20);
        doc.text(`Remaining/Unused Funding: ${unusedFundingSpan.textContent || '£0.00'}`, margin, yPosition + 30);
        doc.text(`Percentage of Maximum Allocation Used: ${percentageUsedSpan.textContent || '0%'}`, margin, yPosition + 40);
        yPosition += 50;
        
        // Page 3: Role Breakdown
        doc.addPage();
        currentPage++;
        yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // Role Breakdown
        yPosition = addSectionTitle('Role Breakdown', yPosition);
        
        // Create role breakdown table
        const roleData = selectedRoles.map(role => [
            role.title,
            role.fte.toFixed(1),
            formatCurrency(role.adjustedSalary),
            formatCurrency(role.adjustedSalary * role.onCostsFactor * role.fte),
            formatCurrency(role.totalCost),
            formatCurrency(role.reimbursement)
        ]);
        
        doc.autoTable({
            startY: yPosition + 5,
            head: [['Role', 'FTE', 'Salary Cost', 'On-costs', 'Total Cost', 'Reimbursement']],
            body: roleData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 9
            },
            margin: { left: margin, right: margin },
            styles: {
                cellPadding: 3,
                overflow: 'linebreak'
            }
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
        
        // Page 4: Funding Chart
        doc.addPage();
        currentPage++;
        yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // Funding Chart
        yPosition = addSectionTitle('Funding Distribution', yPosition);
        
        // Add chart image
        try {
            const chartImg = fundingChart.toDataURL('image/png', 1.0);
            const imgWidth = contentWidth;
            const imgHeight = imgWidth * (fundingChart.height / fundingChart.width);
            doc.addImage(chartImg, 'PNG', margin, yPosition + 5, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
        } catch (error) {
            console.error('Error adding chart to PDF:', error);
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(10);
            doc.text('Chart could not be included in the PDF.', margin, yPosition + 10);
            yPosition += 20;
        }
        
        // Add optimization suggestions
        yPosition = addSectionTitle('Optimization Suggestions', yPosition);
        
        // Get the text content from the optimization suggestions div
        const suggestionsText = optimizationSuggestions.textContent.trim();
        
        // Add the text to the PDF
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(10);
        
        const textLines = doc.splitTextToSize(suggestionsText, contentWidth);
        doc.text(textLines, margin, yPosition + 10);
        
        // Save the PDF
        const fileName = `PCN_ARRS_Funding_Report_${pcnNameHidden.value || 'Unnamed'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
    }
}

function exportToCsv() {
    if (!validateResults()) {
        return;
    }
    
    try {
        let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // Add UTF-8 BOM
        
        // Helper function to clean and escape CSV values
        const escapeCsv = (value) => {
            let cleanedValue = String(value)
                .replace(/£/g, '') // Remove £ symbol
                .replace(/,/g, '') // Remove commas
                .replace(/"/g, '""') // Escape double quotes
                .replace(/\n/g, ' '); // Replace newlines with spaces
            return `"${cleanedValue}"`;
        };
        
        // PCN Information
        csvContent += 'PCN ARRS Funding Report\n';
        csvContent += `PCN Name,${escapeCsv(pcnNameHidden.value || 'Unnamed PCN')}\n`;
        csvContent += `PCN Code,${escapeCsv(pcnCodeInput.value || 'N/A')}\n`;
        csvContent += `Raw List Size,${escapeCsv(rawListSizeInput.value || '0')}\n`;
        csvContent += `Adjusted Population,${escapeCsv(adjustedPopulationInput.value || '0')}\n`;
        csvContent += `London Weighting Applied,${escapeCsv(londonWeightingCheckbox.checked ? 'Yes' : 'No')}\n`;
        csvContent += `Generated Date,${escapeCsv(new Date().toLocaleDateString('en-GB'))}\n\n`;
        
        // Funding Summary
        csvContent += 'Funding Summary\n';
        csvContent += `Maximum ARRS Allocation,${escapeCsv(maxArrsAllocationInput.value || '£0.00')}\n`;
        csvContent += `Total ARRS Funding Claimed,${escapeCsv(totalFundingSpan.textContent || '£0.00')}\n`;
        csvContent += `Remaining/Unused Funding,${escapeCsv(unusedFundingSpan.textContent || '£0.00')}\n`;
        csvContent += `Percentage of Maximum Allocation Used,${escapeCsv(percentageUsedSpan.textContent || '0%')}\n\n`;
        
        // Role Breakdown
        csvContent += 'Role Breakdown\n';
        csvContent += 'Role,FTE,Salary Cost,On-costs,Total Cost,Reimbursement\n';
        
        selectedRoles.forEach(role => {
            const onCosts = role.adjustedSalary * role.onCostsFactor * role.fte;
            csvContent += [
                escapeCsv(role.title),
                escapeCsv(role.fte.toFixed(1)),
                escapeCsv(formatCurrency(role.adjustedSalary)),
                escapeCsv(formatCurrency(onCosts)),
                escapeCsv(formatCurrency(role.totalCost)),
                escapeCsv(formatCurrency(role.reimbursement))
            ].join(',') + '\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `PCN_ARRS_Funding_Report_${pcnNameHidden.value || 'Unnamed'}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('An error occurred while generating the CSV. Please try again.');
    }
}

function validateResults() {
    if (!totalFundingSpan.textContent || totalFundingSpan.textContent === '£0.00') {
        alert('Please calculate funding first to generate the export.');
        return false;
    }
    
    return true;
}

function resetData() {
    // Reset PCN selection
    pcnDisplayInput.value = '';
    pcnNameHidden.value = '';
    pcnCodeInput.value = '';
    
    // Reset population data
    rawListSizeInput.value = '';
    adjustedPopulationInput.value = '';
    maxArrsAllocationInput.value = '';
    
    // Reset London weighting
    londonWeightingCheckbox.checked = false;
    
    // Reset role selection
    REIMBURSABLE_ROLES.forEach(role => {
        const includeCheckbox = document.getElementById(`include-${role.id}`);
        const fteInput = document.getElementById(`fte-${role.id}`);
        
        if (includeCheckbox) {
            includeCheckbox.checked = false;
        }
        
        if (fteInput) {
            fteInput.value = '0';
            fteInput.disabled = true;
        }
    });
    
    // Reset optimization strategy
    optimizationStrategySelect.value = 'maximize-roles';
    customPrioritiesContainer.style.display = 'none';
    
    // Reset calculations
    updateCalculations();
    
    // Hide results
    resultsContainer.style.display = 'none';
    
    // Destroy chart if it exists
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
}

function formatCurrency(value) {
    return '£' + parseFloat(value).toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
