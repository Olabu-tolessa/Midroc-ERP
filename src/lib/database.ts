// Database configuration - Switch between Supabase and MySQL
const DATABASE_TYPE = import.meta.env.VITE_DATABASE_TYPE || 'mysql'; // 'supabase' or 'mysql'

// Export the appropriate services based on database type
export const isDatabaseConfigured = DATABASE_TYPE === 'mysql' || 
  (DATABASE_TYPE === 'supabase' && 
   import.meta.env.VITE_SUPABASE_URL && 
   import.meta.env.VITE_SUPABASE_ANON_KEY);

// Dynamic imports based on database type
export const getContractServices = async () => {
  if (DATABASE_TYPE === 'mysql') {
    const { contractService, contractFormService, subscribeToContracts, subscribeToContractForms } = 
      await import('../services/mysqlContractService');
    return { contractService, contractFormService, subscribeToContracts, subscribeToContractForms };
  } else {
    const { contractService, contractFormService, subscribeToContracts, subscribeToContractForms } = 
      await import('../services/contractService');
    return { contractService, contractFormService, subscribeToContracts, subscribeToContractForms };
  }
};

export const getSupervisionServices = async () => {
  if (DATABASE_TYPE === 'mysql') {
    const { 
      supervisionService, 
      qualitySafetyService, 
      qualityTaskService,
      subscribeToSupervisionReports,
      subscribeToQualitySafetyReports,
      subscribeToQualityTasks
    } = await import('../services/mysqlSupervisionService');
    return { 
      supervisionService, 
      qualitySafetyService, 
      qualityTaskService,
      subscribeToSupervisionReports,
      subscribeToQualitySafetyReports,
      subscribeToQualityTasks
    };
  } else {
    const { 
      supervisionService, 
      qualitySafetyService, 
      qualityTaskService,
      subscribeToSupervisionReports,
      subscribeToQualitySafetyReports,
      subscribeToQualityTasks
    } = await import('../services/supervisionService');
    return { 
      supervisionService, 
      qualitySafetyService, 
      qualityTaskService,
      subscribeToSupervisionReports,
      subscribeToQualitySafetyReports,
      subscribeToQualityTasks
    };
  }
};

export { DATABASE_TYPE };
