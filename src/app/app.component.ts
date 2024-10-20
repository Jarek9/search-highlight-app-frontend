import { Component } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormControl, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { SortPipe } from "./sort.pipe";

interface SearchResult {
  highlightedText: string;
  totalCharacters: number;
  totalWords: number;
  totalOccurrences: number;
  distinctWordsCount: number;
  occurrences: { [key: string]: number };
  firstIndex: { [key: string]: number };
  lastIndex: { [key: string]: number };
  processingTimeInSeconds: number;
  [key: string]: any;
}

interface SortedResult {
  Word: string;
  Count: number;
  "First Index": string | number;
  "Last Index": string | number;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SortPipe,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  inputTextControl = new FormControl("");
  queryTextControl = new FormControl("");
  resultText: string = "";
  statistics: SearchResult = {
    highlightedText: "",
    totalCharacters: 0,
    totalWords: 0,
    totalOccurrences: 0,
    distinctWordsCount: 0,
    occurrences: {},
    firstIndex: {},
    lastIndex: {},
    processingTimeInSeconds: 0,
  };
  sortColumn: string | null = null;
  sortDirection: boolean = true;

  constructor(private http: HttpClient) {}

  onSearch() {
    const inputText = this.inputTextControl.value || "";
    const queryText = this.queryTextControl.value || "";
    const body = { inputText, queryText };
    if (!queryText.trim()) {
      alert("The query cannot be empty or contain only whitespace characters.");
      return;
    }
    this.http
      .post<SearchResult>("http://localhost:8080/api/search", body)
      .subscribe((response) => {
        this.resultText = response.highlightedText;
        this.statistics = {
          highlightedText: response.highlightedText || "",
          totalCharacters: response.totalCharacters,
          totalWords: response.totalWords,
          totalOccurrences: response.totalOccurrences,
          distinctWordsCount: response.distinctWordsCount,
          occurrences: response.occurrences,
          firstIndex: response.firstIndex,
          lastIndex: response.lastIndex,
          processingTimeInSeconds: response.processingTimeInSeconds,
        };
        this.sortedResults = this.getSortedResults();
      });
  }
  sortedResults: any[] = [];

  getDistinctWords(): string[] {
    if (this.statistics && this.statistics.occurrences) {
      return Object.keys(this.statistics.occurrences);
    }
    return [];
  }

  getSortedResults(): any[] {
    return Object.keys(this.statistics.occurrences).map((word) => ({
      Word: word,
      Count: this.statistics.occurrences[word],
      "First Index": this.statistics.firstIndex[word] || "N/A",
      "Last Index": this.statistics.lastIndex[word] || "N/A",
    }));
  }
  sortData(column: string) {
    this.sortedResults = this.getSortedResults();
    this.sortDirection =
      this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;
    this.sortedResults.sort((a: SortedResult, b: SortedResult) => {
      const aValue = a[column as keyof SortedResult];
      const bValue = b[column as keyof SortedResult];
      if (this.sortDirection) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}
bootstrapApplication(AppComponent);
