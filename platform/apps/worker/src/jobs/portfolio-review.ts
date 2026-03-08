export async function runPortfolioReviewJob(input: { portfolioCompanyId: string }) {
  return {
    portfolioCompanyId: input.portfolioCompanyId,
    status: "completed",
    reviewed: true
  };
}
