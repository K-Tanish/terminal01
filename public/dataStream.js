(function () {
  'use strict';

  var INTERVAL_MS = 200;
  var streamInterval = null;
  var seedRows = [];

  var AUTOMATION_TYPES = [
    'Intelligent Process Automation',
    'Robotic Process Automation',
    'AI + RPA',
    'Cognitive Automation',
    'Digital Process Automation'
  ];
  var STATUSES = ['Completed', 'In Progress', 'Failed', 'On Hold', 'Planning'];
  var DEPARTMENTS = ['Finance', 'Human Resources', 'Operations', 'IT', 'Supply Chain', 'Compliance', 'Legal', 'Marketing', 'Sales', 'Customer Service'];
  var INDUSTRIES = ['Banking', 'Insurance', 'Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Pharma', 'Logistics', 'Energy', 'Telecom'];
  var PARTNERS = ['Accenture', 'Deloitte', 'IBM', 'Tata Consultancy Services', 'Wipro', 'Infosys', 'Cognizant', 'Capgemini', 'EY', 'PwC', 'KPMG', 'BCG'];
  var COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'India', 'Poland', 'Australia', 'Canada', 'France', 'Brazil', 'Japan', 'Singapore', 'Netherlands'];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randFloat(min, max, decimals) {
    var v = Math.random() * (max - min) + min;
    return parseFloat(v.toFixed(decimals || 2));
  }

  function randChoice(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function parseCSV(text) {
    var lines = text.split('\n');
    var headers = lines[0].split(',').map(function (h) { return h.trim(); });
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var values = line.split(',');
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j] !== undefined ? values[j].trim() : '';
      }
      // Parse numerics
      row.robots_deployed = parseInt(row.robots_deployed, 10) || 0;
      row.budget_usd = parseFloat(row.budget_usd) || 0;
      row.annual_savings_usd = parseFloat(row.annual_savings_usd) || 0;
      row.roi_percent = parseFloat(row.roi_percent) || 0;
      row.employee_hours_saved = parseInt(row.employee_hours_saved, 10) || 0;
      row.ai_enabled = row.ai_enabled === 'true';
      row.cloud_deployment = row.cloud_deployment === 'true';
      rows.push(row);
    }
    return rows;
  }

  function mutateRow(row) {
    var mutated = Object.assign({}, row);

    // Randomly change some fields
    var r = Math.random();
    if (r < 0.15) {
      mutated.project_status = randChoice(STATUSES);
    }
    if (r < 0.3) {
      var delta = randFloat(-0.05, 0.05);
      mutated.roi_percent = parseFloat((mutated.roi_percent * (1 + delta)).toFixed(2));
      mutated.annual_savings_usd = parseFloat((mutated.budget_usd * (mutated.roi_percent / 100)).toFixed(2));
    }
    if (r < 0.2) {
      mutated.robots_deployed = Math.max(1, mutated.robots_deployed + randInt(-3, 5));
    }
    if (r < 0.1) {
      mutated.employee_hours_saved = mutated.employee_hours_saved + randInt(-200, 500);
    }
    if (r < 0.05) {
      mutated.budget_usd = parseFloat((mutated.budget_usd * (1 + randFloat(-0.02, 0.02))).toFixed(2));
    }
    if (r < 0.08) {
      mutated.automation_type = randChoice(AUTOMATION_TYPES);
    }
    if (r < 0.05) {
      mutated.department = randChoice(DEPARTMENTS);
    }
    if (r < 0.04) {
      mutated.industry = randChoice(INDUSTRIES);
    }
    if (r < 0.03) {
      mutated.implementation_partner = randChoice(PARTNERS);
    }
    if (r < 0.02) {
      mutated.country = randChoice(COUNTRIES);
    }

    // Occasionally inject a new project_id to add new rows
    if (Math.random() < 0.05) {
      var newId = 'PRJ-' + String(randInt(10000, 99999)).padStart(7, '0');
      mutated.project_id = newId;
    }

    return mutated;
  }

  function fireBatch(callback) {
    if (!seedRows.length) return;
    var batchSize = randInt(5, 50);
    var batch = [];
    for (var i = 0; i < batchSize; i++) {
      var idx = randInt(0, seedRows.length - 1);
      batch.push(mutateRow(seedRows[idx]));
    }
    try {
      callback(batch);
    } catch (e) {
      // swallow errors from callback
    }
  }

  function initializeRpaStream(callback, csvUrl) {
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }

    fetch(csvUrl)
      .then(function (res) { return res.text(); })
      .then(function (text) {
        seedRows = parseCSV(text);
        if (!seedRows.length) {
          console.error('[RPA Stream] No rows parsed from CSV');
          return;
        }
        console.log('[RPA Stream] Loaded ' + seedRows.length + ' seed rows. Starting stream...');

        // Ensure the initial dataset has a good mix of all statuses (including Failed)
        seedRows.forEach(function (r) {
          if (Math.random() < 0.15) {
            r.project_status = randChoice(STATUSES);
          }
        });

        // Fire an initial batch immediately with all seed rows
        var initBatch = seedRows.map(function (r) { return Object.assign({}, r); });
        try { callback(initBatch); } catch (e) {}

        streamInterval = setInterval(function () {
          fireBatch(callback);
        }, INTERVAL_MS);
      })
      .catch(function (err) {
        console.error('[RPA Stream] Failed to load CSV:', err);
      });
  }

  function stopRpaStream() {
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
  }

  window.initializeRpaStream = initializeRpaStream;
  window.stopRpaStream = stopRpaStream;
})();
