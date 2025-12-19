
export const verifyBVN = async (bvnNumber) => {
  console.log(`[Mock SmileID] Verifying BVN: ${bvnNumber}...`);

 
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // SCENARIO 1: SUCCESS
  if (bvnNumber === '00000000000') {
    return {
      success: true,
      message: "Verification Successful",
      data: {
        firstName: "Emmanuel",
        lastName: "Okonkwo",
        middleName: "Chukwuma",
        dateOfBirth: "1992-05-14",
        phoneNumber: "08012345678",
        gender: "Male",
        enrollmentBank: "033", // UBA
        enrollmentBranch: "Lagos - Marina",
        photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emmanuel" 
      }
    };
  }

  // SCENARIO 2: FAILURE
  if (bvnNumber === '00000000001') {
    return {
      success: false,
      message: "BVN does not exist or details mismatch.",
      code: "201"
    };
  }

  // SCENARIO 3: DEFAULT (Invalid for test)
  return {
    success: false,
    message: "Invalid Test BVN. Use 00000000000 for success.",
    code: "400"
  };
};