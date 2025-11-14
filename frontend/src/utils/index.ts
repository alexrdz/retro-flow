import type { ColumnType } from "../types";

export function mapColumnTypeToText(columnType: ColumnType) {
    switch (columnType) {
        case "went_well":
            return "What Went Well";
        case "improve":
            return "What Could Improve";
        case "actions":
            return "Action Items";
    }
}
