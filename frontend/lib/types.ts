export interface ResearchRequest {
  topic: string;
}

export interface ResearchResponse {
  topic: string;
  search_results: string;
  scraped_content: string;
  report: string;
  feedback: string;
}
