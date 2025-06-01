---
title: "10. Programming with PL/SQL"
---

import IdealImage from '@theme/IdealImage';

#

##  Programming with PL/SQL

## Foundation of PL/SQL

### 1.1 What is PL/SQL?
PL/SQL is procedural language that extends SQL with programming features like variables and loops. Unlike standard SQL which executes single statements, PL/SQL allows writing blocks of code that execute sequentially. PL/SQL stored directly in the database server

### Comparison with Standard SQL:

| Feature             | SQL | PL/SQL |
|---------------------|-----|--------|
| Variables           | ☐   | ✔️     |
| Loops               | ☐   | ✔️     |
| Error Handling      | ☐   | ✔️     |
| Stored Procedures   | ☐   | ✔️     |

### Why Use PL/SQL?
*   Improves performance (reduces network overhead).
*   Encapsulates business logic in the database.
*   Enables complex operations beyond plain SQL.

---
<div class="page-break"></div>

## PL/SQL in PostgreSQL

In this lecture we will explain the fundamental of PL/SQL in PostgreSQL which named `PL/pgSQL`.

### Fundamentals of PL/pgSQL

#### Data Types and Variables
*   Scalar types (INTEGER, VARCHAR, DATE, etc.)
*   Composite types (ROW, RECORD)
*   Constants and default values

#### Control Structures

**Conditional Logic:**
```sql
IF condition THEN
    -- statements
ELSIF another_condition THEN
    -- statements
ELSE
    -- statements
END IF;
```

**Loop Structures:**
```sql
-- Basic LOOP
LOOP
    EXIT WHEN counter > 10;
    counter := counter + 1;
END LOOP;
```

```sql
-- FOR LOOP
FOR i IN 1..10 BY 2 LOOP
    RAISE NOTICE 'Odd number: %', i;
END LOOP;
```

```sql
-- WHILE LOOP
WHILE total < 1000 LOOP
    total := total * 1.1;
END LOOP;
```

---

### Advanced PL/pgSQL

#### Exception Handling
```sql
BEGIN
    -- Risky operations
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Division by zero occurred';
        RETURN NULL;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Unexpected error: %', SQLERRM;
END;
```

#### Cursors for Row Processing
```sql
DECLARE
    emp_rec RECORD;
    emp_cur CURSOR FOR SELECT * FROM employees;
BEGIN
    OPEN emp_cur;
    LOOP
        FETCH emp_cur INTO emp_rec;
        EXIT WHEN emp_cur%NOTFOUND;

        -- Process each row
    END LOOP;
    CLOSE emp_cur;
END;
```

**Key Attributes:**
*   `%ISOPEN` → Checks if the cursor is open (TRUE/FALSE).
*   `%FOUND` → Returns TRUE if the last fetch retrieved a row.
*   `%NOTFOUND` → Returns TRUE if no more rows are left.
*   `%ROWCOUNT` → Number of rows fetched so far.

#### Dynamic SQL Execution
```sql
EXECUTE format('SELECT * FROM %I WHERE salary > $1', table_name)
    USING min_salary;
```

---
<div class="page-break"></div>

## Stored Procedures and Functions

### What Are Stored Procedures?

**Definition:**
"Named programs stored in the database that execute SQL statements and business logic."

**Key Features:**
*   Accept input parameters
*   Contain procedural logic (IF/LOOP/ERROR)
*   Perform database operations
*   Can return multiple result sets

### 1. Basic Structure of a Stored Procedure
```sql
CREATE OR REPLACE PROCEDURE procedure_name(parameter1 datatype, parameter2 datatype)
LANGUAGE plpgsql
AS $$
BEGIN
    -- SQL statements and logic here
END;
$$;
```

### 2. Simple Example: Adding a Department
Let's create a procedure to add a new department to our company database:
```sql
CREATE OR REPLACE PROCEDURE add_department(
    dept_name VARCHAR(15),
    dept_number INT,
    mgr_ssn CHAR(9),
    mgr_start_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO DEPARTMENT(Dname, Dnumber, Mgr_ssn, Mgr_start_date)
    VALUES (dept_name, dept_number, mgr_ssn, mgr_start_date);

    COMMIT;
    RAISE NOTICE 'Department % added successfully!', dept_name;
END;
$$;
```

### 3. Calling a Stored Procedure
```sql
CALL add_department('Research', 5, '333445555', '2023-05-15');
```

### 4. Procedure with Conditional Logic
Let's create a procedure that gives employees a raise, but with validation:
```sql
CREATE OR REPLACE PROCEDURE give_raise(
    employee_ssn CHAR(9),
    raise_amount DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_salary DECIMAL(10,2);
BEGIN
    -- Get current salary
    SELECT Salary INTO current_salary FROM EMPLOYEE WHERE Ssn = employee_ssn;

    -- Validate raise amount
    IF raise_amount <= 0 THEN
        RAISE EXCEPTION 'Raise amount must be positive';
    END IF;

    -- Update salary
    UPDATE EMPLOYEE
    SET Salary = Salary + raise_amount
    WHERE Ssn = employee_ssn;

    COMMIT;
    RAISE NOTICE 'Employee % salary updated from % to %',
                 employee_ssn, current_salary, current_salary + raise_amount;
END;
$$;
```

### 5. Procedure with Transaction Handling
```sql
CREATE OR REPLACE PROCEDURE transfer_employee(
    emp_ssn CHAR(9),
    new_dept_number INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    old_dept_number INT;
BEGIN
    -- Get current department
    SELECT Dno INTO old_dept_number FROM EMPLOYEE WHERE Ssn = emp_ssn;

    -- Verify new department exists
    IF NOT EXISTS (SELECT 1 FROM DEPARTMENT WHERE Dnumber = new_dept_number) THEN
        RAISE EXCEPTION 'Department % does not exist', new_dept_number;
    END IF;

    -- Update employee department
    UPDATE EMPLOYEE SET Dno = new_dept_number WHERE Ssn = emp_ssn;

    COMMIT;
    RAISE NOTICE 'Employee % transferred from department % to %',
                 emp_ssn, old_dept_number, new_dept_number;
EXCEPTION
    WHEN OTHERS THEN  -- Corrected from "WHEN X THEN" based on common practice
        ROLLBACK;
        RAISE EXCEPTION 'Error transferring employee: %', SQLERRM;
END;
$$;
```

### 6. Procedure with Multiple Operations
Let's create a procedure to assign an employee to a project with hours:
```sql
CREATE OR REPLACE PROCEDURE assign_to_project(
    emp_ssn CHAR(9),
    project_num INT,
    work_hours DECIMAL(3,1)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if employee exists
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE WHERE Ssn = emp_ssn) THEN
        RAISE EXCEPTION 'Employee % does not exist', emp_ssn;
    END IF;

    -- Check if project exists
    IF NOT EXISTS (SELECT 1 FROM PROJECT WHERE Pnumber = project_num) THEN
        RAISE EXCEPTION 'Project % does not exist', project_num;
    END IF;

    -- Check if assignment already exists
    IF EXISTS (SELECT 1 FROM WORKS_ON WHERE Essn = emp_ssn AND Pno = project_num) THEN
        -- Update existing assignment
        UPDATE WORKS_ON
        SET Hours = work_hours
        WHERE Essn = emp_ssn AND Pno = project_num;
        RAISE NOTICE 'Updated hours for employee % on project %', emp_ssn, project_num;
    ELSE
        -- Create new assignment
        INSERT INTO WORKS_ON(Essn, Pno, Hours)
        VALUES (emp_ssn, project_num, work_hours);
        RAISE NOTICE 'Assigned employee % to project % with % hours', emp_ssn, project_num, work_hours;
    END IF;

    COMMIT;
END;
$$;
```

### What Are Functions?

**Definition:**
"Named programs that return a single value or table, usable in SQL statements."

**Key Features:**
*   Must return a value
*   Can be used in SELECT/WHERE clauses
*   Typically read-only

**Simple Function Example**
```sql
CREATE FUNCTION count_employees(dept_id INT)
RETURNS INT AS $$
DECLARE
    total INT;
BEGIN
    SELECT COUNT(*) INTO total
    FROM employees
    WHERE department_id = dept_id;
    RETURN total;
END;
$$ LANGUAGE plpgsql;
```
*   Show usage: `SELECT count_employees(3)`

**Advanced Function Example**
```sql
CREATE FUNCTION department_stats(dept_id INT)
RETURNS TABLE(
    employee_count INT,
    avg_salary DECIMAL(10,2),
    max_salary DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INT,
        AVG(salary),
        MAX(salary)
    FROM employees
    WHERE department_id = dept_id;
END;
$$;
```

**Usage Example:**
```sql
SELECT d.name, (department_stats(d.id)).*
FROM departments d;
```

### Detailed Comparison

| Feature          | Stored Procedure         | Function                   |
|------------------|--------------------------|----------------------------|
| **Execution**    | `CALL proc_name(args)`   | `SELECT func_name(args)`   |
| **Return**       | Optional OUT parameters  | Mandatory RETURN clause    |
| **DML**          | Full CRUD operations     | Typically SELECT only      |
| **Transactions** | Supports COMMIT/ROLLBACK | Runs within caller's transaction |
| **Usage**        | Standalone operations    | Embedded in SQL expressions|
| **Performance**  | Better for batch processing | Better for calculations    |

---
<div class="page-break"></div>

## Triggers and Events in PostgreSQL (PL/pgSQL)

Triggers are special database operations that automatically execute in response to specific events on a table or view. Here's a comprehensive explanation with examples:

### Trigger Fundamentals

**What is a Trigger?**
A stored procedure that automatically runs when:
*   Data is **inserted**, **updated**, or **deleted**
*   **Before** or **after** the operation occurs
*   For **each row** or **each statement**

**Basic Trigger Components**
```sql
CREATE TRIGGER trigger_name
[BEFORE|AFTER|INSTEAD OF] [INSERT|UPDATE|DELETE]
ON table_name
[FOR EACH ROW|FOR EACH STATEMENT]
EXECUTE FUNCTION trigger_function();
```

---

### Trigger Events

**Timing Options**
| Event Timing | Description                                       |
|--------------|---------------------------------------------------|
| `BEFORE`     | Executes **before** the operation (can modify data) |
| `AFTER`      | Executes **after** the operation (cannot modify data)|
| `INSTEAD OF` | Replaces the operation (used with views)          |

**Operation Types**
| Operation  | Description                     |
|------------|---------------------------------|
| `INSERT`   | Triggered on new row insertion  |
| `UPDATE`   | Triggered on row modification   |
| `DELETE`   | Triggered on row deletion       |
| `TRUNCATE` | Triggered on table truncation   |

**Details**
| Details               | Description                     |
|-----------------------|---------------------------------|
| `FOR EACH ROW`        | Fires once per affected row     |
| `FOR EACH STATEMENT`  | Fires once per SQL statement    |

---

### Trigger Function Structure

**Basic Template**
```sql
CREATE OR REPLACE FUNCTION trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger logic here
    RETURN NEW;  -- or OLD or NULL
END;
$$ LANGUAGE plpgsql;
```

**Special Trigger Variables**
| Variable          | Description                                      |
|-------------------|--------------------------------------------------|
| `NEW`             | New row data (for INSERT/UPDATE)                 |
| `OLD`             | Old row data (for UPDATE/DELETE)                 |
| `TG_OP`           | Operation type ('INSERT', 'UPDATE', 'DELETE')    |
| `TG_TABLE_NAME`   | Name of the table that fired the trigger         |

---

### Practical Examples

#### Audit Log Trigger
```sql
-- Create audit table
CREATE TABLE employee_audit (
    operation CHAR(1),
    employee_id INT,
    old_salary NUMERIC,
    new_salary NUMERIC,
    changed_by TEXT,
    change_time TIMESTAMP
);
```

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.salary <> OLD.salary THEN
        INSERT INTO employee_audit
        VALUES (
            'U',
            NEW.id,
            OLD.salary,
            NEW.salary,
            current_user,
            now()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Attach trigger
CREATE TRIGGER salary_audit
AFTER UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION log_salary_change();
```

#### 4.2 Data Validation Trigger
```sql
CREATE OR REPLACE FUNCTION validate_employee_age()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.birth_date > CURRENT_DATE - INTERVAL '18 years' THEN
        RAISE EXCEPTION 'Employee must be at least 18 years old';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
```sql
CREATE TRIGGER check_age
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION validate_employee_age();
```

#### 4.3 Derived Column Trigger
```sql
CREATE OR REPLACE FUNCTION update_full_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_name := NEW.first_name || ' ' || NEW.last_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
```sql
CREATE TRIGGER set_full_name
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_full_name();
```

---

### Advanced Trigger Concepts

#### Conditional Trigger Execution
```sql
CREATE TRIGGER conditional_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_status_change();
```

#### INSTEAD OF Triggers (for Views)
```sql
CREATE VIEW employee_details AS
SELECT e.id, e.name, d.name as dept_name
FROM employees e JOIN departments d ON e.dept_id = d.id;
```
```sql
CREATE OR REPLACE FUNCTION update_employee_view()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE employees SET name = NEW.name WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
```sql
CREATE TRIGGER employee_view_update
INSTEAD OF UPDATE ON employee_details
FOR EACH ROW EXECUTE FUNCTION update_employee_view();
```

#### Statement-Level Trigger
```sql
CREATE OR REPLACE FUNCTION log_bulk_operations()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO operation_log
    VALUES (TG_TABLE_NAME, TG_OP, current_user, now());
    RETURN NULL; -- Required for AFTER statement-level triggers
END;
$$ LANGUAGE plpgsql;
```
```sql
CREATE TRIGGER track_bulk_changes
AFTER INSERT OR UPDATE OR DELETE ON employees
FOR EACH STATEMENT EXECUTE FUNCTION log_bulk_operations();
```

---

### Trigger Management

**Viewing Triggers**
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers;
```

**Disabling/Enabling Triggers**
```sql
ALTER TABLE employees DISABLE TRIGGER salary_audit;
ALTER TABLE employees ENABLE TRIGGER salary_audit;
```

**Dropping Triggers**
```sql
DROP TRIGGER IF EXISTS salary_audit ON employees;
```

### 7. Common Use Cases
1.  **Audit Logging:** Track all data changes
2.  **Data Validation:** Enforce complex business rules
3.  **Derived Columns:** Automatically maintain computed values
4.  **Cross-Table Synchronization:** Keep related tables in sync
5.  **Security Enforcement:** Implement row-level security

### 8. Performance Considerations
1.  **Minimize Trigger Complexity:** Keep trigger logic simple
2.  **Avoid Nested Triggers:** Triggers that fire other triggers
3.  **Consider Statement-Level:** When row-by-row isn't needed
4.  **Benchmark Impact:** Test performance with/without triggers

### 9. Best Practices
1.  **Name Clearly:** Use descriptive names (e.g., `log_salary_changes`)
2.  **Document Triggers:** Comment on purpose and behavior
3.  **Handle Errors:** Use EXCEPTION blocks in trigger functions
4.  **Test Thoroughly:** Verify trigger behavior with edge cases

Triggers provide powerful automation capabilities but should be used judiciously to maintain database performance and clarity.