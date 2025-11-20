import { describe, it } from "vitest";
import * as sql from "../generateSqlQuery";
import { Filters, FilterType } from "@/shared/types/filtering";

describe.concurrent("getFilterIfPresent", () => {
  const filters: Filters = {
    [FilterType.where]: ["value > 0", "time > 0"],
    [FilterType.groupBy]: ["value"],
  };

  it("returns an empty string if filter isn't present", async ({ expect }) => {
    expect(sql.chainFilterParams(FilterType.having, filters)).toBe("");
  });
  it("parses a single filter", async ({ expect }) => {
    expect(sql.chainFilterParams(FilterType.groupBy, filters)).toBe("value");
  });
  it("parses a chain of filters", async ({ expect }) => {
    expect(sql.chainFilterParams(FilterType.where, filters)).toBe(
      "value > 0 AND time > 0"
    );
  });
});

describe.concurrent("getSelectQuery", () => {
  it("returns with an asterisk if provided with an asterisk explicitly", async ({
    expect,
  }) => {
    expect(sql.getSelectQuery("*")).toBe(`SELECT *`);
  });

  it("returns with an asterisk if array is empty", async ({ expect }) => {
    expect(sql.getSelectQuery([])).toBe(`SELECT *`);
  });

  it("selects single value", async ({ expect }) => {
    expect(sql.getSelectQuery([{ column: "coffee" }])).toBe(`SELECT coffee`);
  });

  it("selects multiple values", async ({ expect }) => {
    expect(sql.getSelectQuery([{ column: "coffee" }, { column: "tea" }])).toBe(
      `SELECT coffee, tea`
    );
  });

  it("selects with alias", async ({ expect }) => {
    expect(sql.getSelectQuery([{ column: "coffee", as: "first" }])).toBe(
      `SELECT coffee AS first`
    );
  });

  it("selects multiple mixed up values (w/o aliases)", async ({ expect }) => {
    expect(
      sql.getSelectQuery([
        { column: "beverageId" },
        { column: "coffee", as: "first" },
        { column: "tea", as: "second" },
      ])
    ).toBe(`SELECT beverageId, coffee AS first, tea AS second`);
  });
});

describe.concurrent("generateSqlQuery", () => {
    it("parses query without filters", async ({ expect }) => {
      const tableName = "students";
      const select = [{ column: "id", as: "studentId" }, { column: "height" }];
      const filters: Filters = {};
      expect(sql.generateSqlQuery(select, tableName, filters)).toBe(
        `SELECT id AS studentId, height FROM students;`
      );
    });

    it("parses complex query with a gap in parameters", async ({ expect }) => {
      const tableName = "students";
      const select = [{ column: "id", as: "studentId" }, { column: "height" }];
      const filters: Filters = {
        [FilterType.where]: ["height > 180", "age >= 20"],
        [FilterType.regex]: ["university LIKE '%of informatics%'"],
        [FilterType.groupBy]: ["course"],
      };
      expect(sql.generateSqlQuery(select, tableName, filters)).toBe(
        `SELECT id AS studentId, height FROM students
WHERE height > 180 AND age >= 20
university LIKE '%of informatics%'
GROUP BY course;`
      );
    });

  it("parses complex query with all parameters", async ({ expect }) => {
    const tableName = "students";
    const select = [{ column: "id", as: "studentId" }, { column: "height" }];
    const filters: Filters = {
      [FilterType.where]: ["height > 180", "age >= 20"],
      [FilterType.caseQuery]: [
        "CASE age == 18 THEN 1st CASE age == 19 THEN 2nd ELSE NULL END",
      ],
      [FilterType.nullHandlingRule]: ["COALESCE(third_name, 'none')"],
      [FilterType.regex]: ["university LIKE '%of informatics%'"],
      [FilterType.subquery]: [
        "SELECT (name FROM teachers WHERE teachers.student_id == students.student_id) AS teacher_name",
      ],
      [FilterType.aggregate]: [
        "AVG(grades) AS average_grade, AVG(skips) AS skip_ratio",
      ],
      [FilterType.groupBy]: ["course"],
      [FilterType.having]: ["course <= 4"],
      [FilterType.orderBy]: ["name DESC"],
    };
    expect(sql.generateSqlQuery(select, tableName, filters)).toBe(
      `SELECT id AS studentId, height FROM students
WHERE height > 180 AND age >= 20
CASE age == 18 THEN 1st CASE age == 19 THEN 2nd ELSE NULL END
COALESCE(third_name, 'none')
university LIKE '%of informatics%'
SELECT (name FROM teachers WHERE teachers.student_id == students.student_id) AS teacher_name
AVG(grades) AS average_grade, AVG(skips) AS skip_ratio
GROUP BY course
HAVING course <= 4
ORDER BY name DESC;`
    );
  });
});
