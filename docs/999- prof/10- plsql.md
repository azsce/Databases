---
title: "10. Programming with PL/SQL"
---

#

## Programming with PL/SQL

Good morning, everyone. Today, we're diving into `PL/SQL`, which stands for Procedural Language extensions to SQL. This is a powerful tool that significantly enhances what we can do with standard SQL.

### Foundation of PL/SQL

#### 1.1 What is PL/SQL?
So, what exactly is `PL/SQL`? As you can see on the slide, it's a procedural language that builds upon SQL by adding programming features we're familiar with from other languages, such as variables and loops.

Now, standard SQL, as we've learned, typically executes single statements one at a time. Think of it as giving one command and getting one result. `PL/SQL` changes this paradigm. It allows us to write blocks of code – multiple statements grouped together – that execute sequentially, one after the other, as a single unit. A key aspect here is that these `PL/SQL` blocks can be stored directly within the database server itself. This has some significant advantages, which we'll touch upon shortly.

---
#### Comparison with Standard SQL:

Let's take a closer look at how `PL/SQL` stacks up against standard SQL. The table on your slide highlights some key differences.

*   **Variables:** In standard SQL, the concept of user-defined variables within a query block is quite limited. `PL/SQL`, however, fully supports variables. This means you can declare placeholders to store data temporarily, manipulate it, and use it throughout your code block, making your logic much more dynamic.

*   **Loops:** Standard SQL doesn't have explicit loop structures for iterating over a set of operations multiple times within a single command. `PL/SQL` introduces loops, like `FOR` loops or `WHILE` loops, allowing you to repeat actions, which is incredibly useful for complex data processing.

*   **Error Handling:** Basic SQL might throw an error and stop. `PL/SQL` provides robust error handling mechanisms. You can define `EXCEPTION` blocks to catch errors gracefully, log them, or even attempt recovery actions, making your database programs more resilient.

*   **Stored Procedures:** While some database systems have ways to store SQL, `PL/SQL` is inherently designed for creating `stored procedures` and `functions`. These are named blocks of `PL/SQL` code stored in the database that can be called and executed on demand. This is a cornerstone of `PL/SQL`.

You can see the checkmarks on the slide clearly indicating that these features are the domain of `PL/SQL`, not standard SQL.

---
#### Why Use PL/SQL?

So, why go to the trouble of learning and using `PL/SQL`? There are several compelling reasons.

*   First, it **improves performance**. When you send individual SQL statements from an application to the database, each one incurs network overhead – the time it takes for the command to travel to the server and the result to come back. With `PL/SQL`, you can bundle many operations into a single block that executes on the server. This significantly reduces network traffic and can lead to much faster applications.

*   Second, `PL/SQL` allows you to **encapsulate business logic directly in the database**. Imagine rules like "if a customer's order is over $100, apply a 10% discount." Instead of coding this logic in every application that interacts with the database, you can write it once in a `PL/SQL` stored procedure. This ensures consistency and makes maintenance easier. If the rule changes, you change it in one place – the database.

*   And third, it **enables complex operations beyond plain SQL**. While SQL is powerful for querying and manipulating data, some tasks require more intricate procedural logic, conditional execution, and iterative processing. `PL/SQL` provides the tools to handle these complex scenarios efficiently within the database environment.

These benefits make `PL/SQL` an indispensable tool for database developers.

---
<div class="page-break"></div>

## PL/SQL in PostgreSQL

Now, while `PL/SQL` is most famously associated with Oracle databases, other database systems have their own procedural language extensions. In PostgreSQL, the equivalent is called `PL/pgSQL`, which stands for Procedural Language/PostgreSQL SQL. It's heavily inspired by Oracle's `PL/SQL` and offers very similar capabilities.

In this lecture, when we talk about implementing these concepts, we'll be focusing on `PL/pgSQL` as used in PostgreSQL.

### Fundamentals of PL/pgSQL

Let's get into the fundamentals of `PL/pgSQL`.

#### Data Types and Variables
Just like any programming language, `PL/pgSQL` works with data, and this data needs to have types.

*   You have your **scalar types**. These are the basic, single-value data types you're already familiar with from SQL, such as `INTEGER` for whole numbers, `VARCHAR` for variable-length strings, `DATE` for dates, and so on.

*   Then there are **composite types**. These are more complex. `ROW` types allow you to declare a variable that can hold an entire row from a table, or a row resulting from a query. `RECORD` types are similar but more flexible, as they don't need to be predefined; their structure can be determined at runtime. These are very useful when you're fetching multiple columns from a table into a single variable.

*   `PL/pgSQL` also supports **constants and default values**. You can declare a constant whose value cannot be changed, or assign a default value to a variable if one isn't explicitly provided.

Understanding these data types is crucial for writing effective `PL/pgSQL` code.

---
#### Control Structures

Control structures are the heart of procedural logic, dictating the flow of execution in your code. `PL/pgSQL` provides robust conditional and looping constructs.

**Conditional Logic:**
The slide shows the basic structure of an `IF` statement. This is fundamental for making decisions in your code.
You start with an `IF` followed by a condition. If that condition evaluates to true, the statements immediately following the `THEN` keyword are executed.
You can have optional `ELSIF` clauses. `ELSIF` allows you to check another condition if the preceding `IF` or `ELSIF` conditions were false.
And finally, an optional `ELSE` clause can provide a block of code to execute if none of the preceding `IF` or `ELSIF` conditions were met.
Every `IF` block must be terminated with an `END IF;`. This clear structure allows for complex decision trees.

---
**Loop Structures:**
Next, let's look at loops, which allow you to repeat blocks of code.

*   The first example on the slide is a **Basic LOOP**. This is the simplest form of loop. It starts with the `LOOP` keyword and ends with `END LOOP;`. Inside the loop, you typically have some logic, and crucially, an `EXIT WHEN` condition. In this example, the loop continues as long as the `counter` variable is not greater than 10. The line `counter := counter + 1;` shows the assignment operator, `:=`, used in `PL/pgSQL` to increment the counter. Without an `EXIT` condition or a way to break out, a basic loop would run forever!

*   Then we have the **FOR LOOP**. This is often used when you want to iterate a specific number of times or over a set of values. The example shows `FOR i IN 1..10 BY 2 LOOP`. This means the loop variable `i` will start at 1, go up to 10 (inclusive), and increment by 2 in each iteration. So, `i` will take values 1, 3, 5, 7, and 9. Inside the loop, `RAISE NOTICE` is a `PL/pgSQL` command used to send a message or informational output, often for debugging or logging. Here, it's displaying the odd numbers. The loop automatically handles the incrementing and termination.

*   The third type is the **WHILE LOOP**. The example shows `WHILE total < 1000 LOOP`. This loop will continue to execute as long as the condition – `total` being less than 1000 – remains true. Inside the loop, `total` is being multiplied by 1.1. Once `total` becomes 1000 or more, the condition becomes false, and the loop terminates.

These loop structures provide the flexibility to handle various iterative tasks.

---
<div class="page-break"></div>

### Advanced PL/pgSQL

Now that we've covered the basics, let's move on to some more advanced features of `PL/pgSQL`.

#### Exception Handling
Things don't always go as planned in programming. Errors, or `exceptions`, can occur. Robust applications need to handle these gracefully.

The slide shows a `BEGIN...EXCEPTION...END` block, which is `PL/pgSQL`'s mechanism for error handling.
You place your main code, the "Risky operations," within the `BEGIN` section.
If an error occurs during the execution of this code, control jumps to the `EXCEPTION` section.
Here, you can have multiple `WHEN` clauses to catch specific types of errors.
The example shows `WHEN division_by_zero THEN`. If a division by zero error occurs, the code under this `WHEN` clause is executed. In this case, it raises a notice and then `RETURN NULL;` – perhaps to indicate failure to a calling function.
The `WHEN OTHERS THEN` clause is a catch-all. If an error occurs that isn't specifically handled by a preceding `WHEN` clause, this block will execute. `SQLERRM` is a special variable that contains the error message associated with the current exception. Here, it's being used to raise a more informative exception message.
This structure is vital for creating reliable `PL/pgSQL` programs.

---
#### Cursors for Row Processing
Sometimes, you need to process the results of a query one row at a time. This is where `cursors` come in. A `cursor` is essentially a pointer to a result set.

The example demonstrates the typical workflow:
First, in the `DECLARE` section, a cursor named `emp_cur` is declared. The declaration associates the cursor with a `SELECT` statement – in this case, selecting all columns from the `employees` table. A `RECORD` variable `emp_rec` is also declared to hold the data for each row as we fetch it.

Then, in the `BEGIN` block:
1.  `OPEN emp_cur;` executes the query associated with the cursor and positions the cursor before the first row of the result set.
2.  A `LOOP` is started to iterate through the rows.
3.  `FETCH emp_cur INTO emp_rec;` retrieves the next row from the result set and stores its values into the `emp_rec` record variable.
4.  `EXIT WHEN emp_cur%NOTFOUND;` checks a cursor attribute. `%NOTFOUND` becomes true when the `FETCH` operation tries to get a row but there are no more rows left in the result set. When this happens, the loop terminates.
5.  Inside the loop, there's a comment "-- Process each row". This is where you'd put your logic to work with the data in `emp_rec` for the current row.
6.  Finally, `CLOSE emp_cur;` releases the resources held by the cursor. It's important to close cursors when you're done with them.

---
**Key Attributes:**
`PL/pgSQL` cursors have several attributes that provide information about their state. The slide lists a few important ones:

*   `%ISOPEN`: This attribute returns `TRUE` if the cursor is currently open and `FALSE` otherwise. You might use this to check if a cursor needs to be opened or to avoid errors from operating on a closed cursor.

*   `%FOUND`: After a `FETCH` operation, `%FOUND` returns `TRUE` if the fetch successfully retrieved a row. It returns `FALSE` if no row was retrieved (e.g., at the end of the result set).

*   `%NOTFOUND`: This is the logical opposite of `%FOUND`. It returns `TRUE` if the last fetch did *not* retrieve a row, which is commonly used as the condition to exit a loop, as we saw in the previous example.

*   `%ROWCOUNT`: This attribute gives you the number of rows that have been fetched from the cursor so far in its current open state. This can be useful for tracking progress or for operations that depend on the number of rows processed.

Understanding and using these attributes allows for fine-grained control over cursor operations.

---
#### Dynamic SQL Execution
Sometimes, you might not know the exact structure of an SQL query at the time you write your `PL/pgSQL` code. For example, the table name or parts of the `WHERE` clause might need to be constructed dynamically based on input parameters or other conditions. `PL/pgSQL` allows for this using the `EXECUTE` command.

The slide shows an example: `EXECUTE format('SELECT * FROM %I WHERE salary > $1', table_name) USING min_salary;`

Let's break this down:
The `EXECUTE` command is what runs the dynamically constructed SQL string.
The `format()` function is used here to build the SQL string safely. The string `'SELECT * FROM %I WHERE salary > $1'` is a template.
`%I` is a format specifier that safely quotes an SQL identifier, like a table or column name. In this case, it will be replaced by the value of the `table_name` variable. This is important for preventing SQL injection vulnerabilities when table or column names are dynamic.
`$1` is a placeholder for a value that will be passed in later.
The `table_name` variable provides the actual table name to be inserted at `%I`.
The `USING min_salary` clause provides the value for the `$1` placeholder. So, the value of the `min_salary` variable will be used in the comparison for the `salary` column.

This allows you to build and run very flexible SQL queries whose structure isn't fixed at compile time.

---
<div class="page-break"></div>

## Stored Procedures and Functions

We've mentioned stored procedures and functions a few times. Now, let's define them more formally and see how they're structured. These are fundamental building blocks in `PL/pgSQL` for creating reusable and modular code.

### What Are Stored Procedures?

**Definition:**
A `stored procedure` is, as the slide says, a "Named program stored in the database that executes SQL statements and business logic."
Think of it as a pre-compiled collection of `PL/SQL` and SQL statements that performs a specific task. Because it's named and stored in the database, applications can call this procedure by its name, rather than re-sending all the individual SQL statements each time.

---
**Key Features:**
Stored procedures have several important characteristics:

*   They can **accept input parameters**. This means you can pass data into the procedure when you call it, allowing it to operate on different data values each time it's run. For example, a procedure to update an employee's salary might take the employee ID and the new salary as input parameters.

*   They **contain procedural logic**. This is where the power of `PL/SQL` comes in. Inside a stored procedure, you can use `IF/THEN/ELSE` statements for conditional execution, `LOOP` structures for iteration, and `EXCEPTION` handling for errors, just as we've discussed.

*   They can **perform database operations**. This is a primary use case. Stored procedures can execute any SQL DML statements like `INSERT`, `UPDATE`, `DELETE`, as well as `SELECT` statements to retrieve data. They can also manage transactions with `COMMIT` and `ROLLBACK`.

*   And, importantly, they **can return multiple result sets** in some database systems, though in PostgreSQL, procedures are primarily for performing actions. If you need to return data, especially tabular data, functions are often preferred. However, procedures can use `OUT` parameters to return individual values.

---
### 1. Basic Structure of a Stored Procedure

Let's look at the syntax for creating a stored procedure in `PL/pgSQL`.

The slide shows: `CREATE OR REPLACE PROCEDURE procedure_name(parameter1 datatype, parameter2 datatype) ...`
*   `CREATE OR REPLACE PROCEDURE`: This command either creates a new procedure or, if a procedure with the same name already exists, it replaces the old one. This is very convenient during development.
*   `procedure_name`: This is the unique name you give to your procedure.
*   Inside the parentheses, you define the parameters: `parameter1 datatype, parameter2 datatype`. Each parameter has a name and a SQL data type (like `INT`, `VARCHAR`, `DATE`). Parameters can be `IN` (input, the default), `OUT` (output), or `INOUT` (both).
*   `LANGUAGE plpgsql`: This clause specifies that the procedure is written in the `PL/pgSQL` language. PostgreSQL supports procedures in other languages too, but `PL/pgSQL` is the most common for database-centric logic.
*   `AS $$ ... $$;`: The body of the procedure is enclosed within dollar quotes (`$$`). This is a PostgreSQL-specific way to quote string literals, which is very useful for writing blocks of code that might themselves contain single quotes, avoiding quoting hell.
*   Inside the dollar quotes, you have the standard `PL/pgSQL` block structure: an optional `DECLARE` section for variables (not shown in this basic template but often used), and then a `BEGIN ... END;` block where your SQL statements and procedural logic reside.

This template forms the basis for all stored procedures you'll write.

---
### 2. Simple Example: Adding a Department

Let's look at a concrete example: a procedure to add a new department to a company database.

The `CREATE OR REPLACE PROCEDURE` statement defines a procedure named `add_department`.
It takes four input parameters:
*   `dept_name` of type `VARCHAR(15)`
*   `dept_number` of type `INT`
*   `mgr_ssn` of type `CHAR(9)` – this would be the social security number, a unique identifier, for the department manager. For our example, we can think of this as a placeholder like '123456789'.
*   `mgr_start_date` of type `DATE`

The language is `plpgsql`.
Inside the `BEGIN...END` block:
*   An `INSERT` statement is used to add a new row to the `DEPARTMENT` table. The columns `Dname`, `Dnumber`, `Mgr_ssn`, and `Mgr_start_date` in the table are populated with the values passed in as parameters (`dept_name`, `dept_number`, `mgr_ssn`, `mgr_start_date`).
*   `COMMIT;` makes the changes permanent in the database.
*   `RAISE NOTICE` is used to output a confirmation message, indicating that the department was added successfully, and it even includes the department name using the `%` placeholder.

This is a straightforward but very practical example of how a stored procedure can encapsulate a common database operation.

---
### 3. Calling a Stored Procedure

Once a stored procedure is created, how do you use it? You call it.
The slide shows the syntax: `CALL add_department('Research', 5, '333445555', '2023-05-15');`

*   The `CALL` keyword is used to execute a stored procedure.
*   This is followed by the procedure name, `add_department`.
*   Then, in parentheses, you provide the actual values for the input parameters, in the order they were defined.
    *   'Research' is for `dept_name`.
    *   5 is for `dept_number`.
    *   '333445555' is the manager's SSN (again, an example unique ID).
    *   '2023-05-15' is the manager's start date.

When this `CALL` statement is executed, the `PL/pgSQL` code inside the `add_department` procedure will run with these specific values.

---
### 4. Procedure with Conditional Logic

Stored procedures often need to make decisions. Let's see an example that gives an employee a raise, but with some validation.

The procedure is named `give_raise`.
It takes two input parameters:
*   `employee_ssn` of type `CHAR(9)` (the employee's unique identifier).
*   `raise_amount` of type `DECIMAL(10,2)` (a decimal number with 10 total digits, 2 of which are after the decimal point).

Inside the `AS $$ ... $$` block:
*   We have a `DECLARE` section. Here, a local variable `current_salary` of type `DECIMAL(10,2)` is declared. This variable will be used to store the employee's salary before the raise.
*   In the `BEGIN` block:
    *   First, a comment indicates "Get current salary". A `SELECT` statement retrieves the `Salary` from the `EMPLOYEE` table for the given `employee_ssn` and stores it `INTO` the `current_salary` variable.
    *   Next, "Validate raise amount". An `IF` statement checks if `raise_amount` is less than or equal to 0. If it is, a `RAISE EXCEPTION` command is executed. This stops the procedure and reports an error message: 'Raise amount must be positive'. This is important data validation.
    *   If the raise amount is valid (i.e., positive), the `END IF` is reached, and execution continues to "Update salary". An `UPDATE` statement modifies the `EMPLOYEE` table, setting the `Salary` to the current `Salary` plus the `raise_amount` for the specified `employee_ssn`.
    *   `COMMIT;` saves the salary update.
    *   Finally, `RAISE NOTICE` provides feedback, showing the employee's SSN, their old salary (from `current_salary`), and their new salary (calculated as `current_salary + raise_amount`).

This example demonstrates how to combine data retrieval, conditional logic, data modification, and error handling within a single procedure.

---
<div class="page-break"></div>

### 5. Procedure with Transaction Handling

Transactions are crucial for maintaining data integrity, especially when a procedure involves multiple database operations. A transaction ensures that all operations complete successfully, or if any one fails, all are rolled back.

Let's examine the `transfer_employee` procedure. This procedure aims to move an employee to a new department.
It takes two input parameters:
*   `emp_ssn` of type `CHAR(9)`.
*   `new_dept_number` of type `INT`.

In the `DECLARE` section:
*   A variable `old_dept_number` of type `INT` is declared to store the employee's current department number.

In the `BEGIN` block:
*   First, it gets the current department: a `SELECT` query fetches the `Dno` (department number) from the `EMPLOYEE` table for the given `emp_ssn` and stores it into `old_dept_number`.
*   Next, it verifies if the new department exists: An `IF NOT EXISTS` condition checks the `DEPARTMENT` table. It looks for a department with `Dnumber` equal to `new_dept_number`. If no such department is found (the subquery `SELECT 1 FROM DEPARTMENT...` returns no rows), then `NOT EXISTS` is true, and a `RAISE EXCEPTION` occurs, indicating 'Department % does not exist', with the `new_dept_number` included in the message.
*   If the new department *does* exist, the code proceeds to update the employee's department: An `UPDATE` statement sets the `Dno` in the `EMPLOYEE` table to `new_dept_number` for the specified `emp_ssn`.
*   `COMMIT;` is called to make the transfer permanent.
*   A `RAISE NOTICE` confirms the transfer, showing the employee's SSN, their old department number, and their new department number.

Now, look at the `EXCEPTION` block at the end:
*   `WHEN OTHERS THEN`: This will catch *any* error that might have occurred during the `BEGIN` block that wasn't specifically handled. (The OCR shows `WHEN X THEN`, which is likely a placeholder; `WHEN OTHERS` is the standard way to catch all other errors).
*   `ROLLBACK;`: If an error occurs, this command undoes any changes made by the procedure since the last `COMMIT` (or the start of the procedure if no `COMMIT` occurred within it). This is critical. If, for instance, the `UPDATE EMPLOYEE` statement failed for some reason after the new department check, we wouldn't want a partially completed operation.
*   `RAISE EXCEPTION 'Error transferring employee: %', SQLERRM;`: After rolling back, it re-raises an exception with a custom message, including `SQLERRM` which contains the original system error message. This provides information about what went wrong.

This procedure beautifully illustrates how to group operations into a transaction and handle potential failures gracefully.

---
<div class="page-break"></div>

### 6. Procedure with Multiple Operations

Often, a business process involves several checks and potential actions. This example, `assign_to_project`, demonstrates a procedure that assigns an employee to a project, including handling cases where the assignment might already exist.

It takes three input parameters:
*   `emp_ssn` (`CHAR(9)`)
*   `project_num` (`INT`)
*   `work_hours` (`DECIMAL(3,1)`) – for example, 3.5 hours.

Inside the `BEGIN` block:
*   **First check**: "Check if employee exists". An `IF NOT EXISTS` checks the `EMPLOYEE` table for the given `emp_ssn`. If the employee doesn't exist, it raises an exception.
*   **Second check**: "Check if project exists". Similarly, it checks the `PROJECT` table for the `project_num`. If not found, an exception is raised. These initial checks ensure data integrity before proceeding.
*   **Third check**: "Check if assignment already exists". This uses an `IF EXISTS` condition to look into the `WORKS_ON` table (presumably a table linking employees to projects with hours worked). It checks if a row already exists for this `emp_ssn` AND `project_num`.
    *   **If the assignment exists** (the `IF EXISTS` is true): The logic under `THEN` executes. It's an "Update existing assignment". An `UPDATE` statement modifies the `WORKS_ON` table, setting the `Hours` to the new `work_hours` for the given employee and project. A `RAISE NOTICE` confirms the update. The OCR has a semicolon before `ELSE`, which seems like a typo in the source; the notice should be part of the `THEN` block.
    *   **If the assignment does NOT exist** (the `ELSE` part): The logic for "Create new assignment" executes. An `INSERT` statement adds a new row to `WORKS_ON` with the `emp_ssn`, `project_num`, and `work_hours`. A `RAISE NOTICE` confirms the new assignment.
*   Finally, `COMMIT;` saves all changes made (either the update or the insert).

This procedure shows a common pattern: validate inputs, check for existing data, and then either update existing records or insert new ones based on those checks.

---
<div class="page-break"></div>

### What Are Functions?

We've talked a lot about procedures. Now let's shift focus slightly to `functions`. While similar to procedures in that they are named blocks of code, functions have a distinct primary purpose.

**Definition:**
As the slide states, functions are "Named programs that return a single value or table, usable in SQL statements."
The key difference here is that a function *must* return a value (or a set of rows if it's a table function). This return value can then be used directly within SQL queries, much like built-in SQL functions (e.g., `COUNT()`, `SUM()`, `UPPER()`).

---
**Key Features:**
Let's highlight the key characteristics of functions:

*   **Must return a value:** This is the defining feature. Every function has a `RETURNS` clause specifying the data type of the value it will output. This could be a scalar type like `INT` or `VARCHAR`, or it could be a `TABLE`.

*   **Can be used in SELECT/WHERE clauses:** Because functions return values, you can incorporate them directly into your SQL queries. For example, you could use a function in the `SELECT` list to compute a value for each row, or in a `WHERE` clause to filter rows based on a calculated result.

*   **Typically read-only:** While functions *can* modify data in some database systems (though it's often discouraged as a best practice to keep their purpose clear), their primary design is for computation and returning data, not for performing DML operations like `INSERT`, `UPDATE`, or `DELETE`. Procedures are generally preferred for data modification tasks. Keeping functions read-only helps prevent side effects and makes them easier to reason about when used in queries.

---
**Simple Function Example**

Let's look at a basic function, `count_employees`, which counts the number of employees in a given department.

*   `CREATE FUNCTION count_employees(dept_id INT)`: This defines a function named `count_employees` that accepts one input parameter, `dept_id` of type `INT`.
*   `RETURNS INT AS $$ ... $$`: This specifies that the function will return a single integer value. The body of the function is again enclosed in dollar quotes.
*   `DECLARE total INT;`: Inside the function body, a local variable `total` of type `INT` is declared to store the count.
*   `BEGIN ... END;`:
    *   `SELECT COUNT(*) INTO total FROM employees WHERE department_id = dept_id;`: This is the core logic. A `SELECT COUNT(*)` query counts all rows in the `employees` table where the `department_id` column matches the input `dept_id` parameter. The result of this count is stored `INTO` the local `total` variable.
    *   `RETURN total;`: The function then returns the value stored in the `total` variable.
*   `$$ LANGUAGE plpgsql;`: Specifies that the function is written in `PL/pgSQL`.

**Show usage:**
The slide shows how to use this function: `SELECT count_employees(3);`
This SQL query calls the `count_employees` function, passing the value `3` as the `dept_id`. The function will execute, count the employees in department 3, and return that count. The `SELECT` statement will then display this returned count. This demonstrates how seamlessly functions can be integrated into SQL.

---

Okay, here's the continuation of the lecture script for the second half of the slides.

---
**Advanced Function Example**

Functions can also return more complex data structures, like a table. This example, `department_stats`, is designed to return several statistics for a given department.

*   `CREATE FUNCTION department_stats(dept_id INT)`: The function is named `department_stats` and takes a `dept_id` (integer) as input.
*   `RETURNS TABLE( employee_count INT, avg_salary DECIMAL(10,2), max_salary DECIMAL(10,2) )`: This is the interesting part. Instead of returning a single scalar value, this function `RETURNS TABLE`. The structure of the table it returns is defined right here: it will have three columns:
    *   `employee_count` of type `INT`.
    *   `avg_salary` of type `DECIMAL(10,2)`.
    *   `max_salary` of type `DECIMAL(10,2)`.
*   `LANGUAGE plpgsql AS $$ ... $$`: Again, it's a `PL/pgSQL` function.
*   `BEGIN ... END;`:
    *   `RETURN QUERY SELECT COUNT(*)::INT, AVG(salary), MAX(salary) FROM employees WHERE department_id = dept_id;`: This is how a table function returns its result set. The `RETURN QUERY` command executes the `SELECT` statement that follows it, and the result set of this `SELECT` statement becomes the table returned by the function.
        *   The `SELECT` statement itself calculates three aggregate values from the `employees` table for the given `dept_id`:
            *   `COUNT(*)::INT`: Counts all employees. The `::INT` is a PostgreSQL cast to ensure the count is returned as an integer, matching the `employee_count INT` definition in the `RETURNS TABLE` clause.
            *   `AVG(salary)`: Calculates the average salary.
            *   `MAX(salary)`: Finds the maximum salary.
        *   These three calculated values will form a single row in the table returned by the function, matching the column structure defined in `RETURNS TABLE`.

---
**Usage Example:**

How do you use a function that returns a table? You can treat it much like a regular table in the `FROM` clause of a query, or access its columns.

The slide shows: `SELECT d.name, (department_stats(d.id)).* FROM departments d;`
Let's break this down:
*   `FROM departments d`: We're querying the `departments` table, aliased as `d`.
*   `SELECT d.name, ...`: For each department, we're selecting its name (`d.name`).
*   `(department_stats(d.id)).*`: This is where our table function is called. For each department `d` from the `departments` table, we call `department_stats(d.id)`, passing the current department's ID.
    *   The call `department_stats(d.id)` returns a single row with `employee_count`, `avg_salary`, and `max_salary` for that department.
    *   The parentheses `(...)` around `department_stats(d.id)` make its result (the single-row table) behave like a record.
    *   The `.*` then expands all columns from this returned record/table. So, for each department, we'll get its name, followed by the employee count, average salary, and maximum salary for that department, all on the same row of the output.

This is a powerful way to encapsulate complex calculations that produce tabular results and then easily join or integrate those results into other queries.

---
### Detailed Comparison

The slide now presents a table summarizing the key differences between Stored Procedures and Functions. Let's quickly review these distinctions, as they are important for choosing the right tool for the job.

*   **Execution:**
    *   Stored Procedures are typically invoked using the `CALL proc_name(args)` statement. Their primary purpose is to perform an action or a set of actions.
    *   Functions are generally invoked within an SQL expression, most commonly a `SELECT func_name(args)` statement, because they are designed to return a value that can be used as part of that expression.

*   **Return:**
    *   Stored Procedures in `PL/pgSQL` don't use a `RETURN` statement in the same way functions do to return a primary result. They can, however, use `OUT` or `INOUT` parameters to pass values back to the caller.
    *   Functions *must* have a `RETURN` clause specifying the data type of the value they return (or `RETURNS TABLE` for table functions). They use the `RETURN` statement within their body to send back the result.

*   **DML (Data Manipulation Language - INSERT, UPDATE, DELETE):**
    *   Stored Procedures are well-suited for performing full CRUD (Create, Read, Update, Delete) operations. They can freely execute `INSERT`, `UPDATE`, `DELETE` statements and manage transactions.
    *   Functions are *typically* `SELECT` only. While technically they *can* perform DML in some contexts, it's generally considered bad practice because it can lead to unexpected side effects when a function is used within a query. The expectation is that a function used in a `SELECT` statement primarily computes and returns data without altering database state.

*   **Transactions:**
    *   Stored Procedures can fully manage their own transactions. They can contain `COMMIT` and `ROLLBACK` statements to control the atomicity of the operations they perform.
    *   Functions, when called from within an SQL statement, run within the transaction context of that calling SQL statement. They don't typically manage their own top-level transactions.

*   **Usage:**
    *   Stored Procedures are often used for standalone operations or to encapsulate a complete business process (e.g., "transfer an employee," "process an order").
    *   Functions are designed to be embedded in SQL expressions, used for calculations, data transformations, or returning data to be used by the calling query.

*   **Performance:**
    *   Stored Procedures can be better for batch processing or complex transactional logic because they reduce network round-trips by executing a larger block of work on the server.
    *   Functions can be highly efficient for calculations, especially when they are "immutable" (always return the same result for the same inputs), as the database optimizer can sometimes cache their results or integrate them very efficiently into query plans.

Understanding these differences will help you decide whether a stored procedure or a function is more appropriate for a given task.

---
<div class="page-break"></div>

## Triggers and Events in PostgreSQL (PL/pgSQL)

Now we move on to another powerful database feature: `Triggers`. Triggers are a specialized type of stored procedure that automatically executes, or "fires," in response to certain events occurring on a table or view.

They are fundamental for implementing complex business rules, auditing, maintaining data integrity, and automating tasks directly within the database.

### Trigger Fundamentals

#### What is a Trigger?
A `trigger` is essentially a stored procedure that is implicitly invoked by the database system. You don't call it directly; the database calls it for you. This automatic execution happens when:

*   Data in a specified table is **inserted**, **updated**, or **deleted**. These are the DML events that can activate a trigger.
*   The trigger can be defined to fire either **Before** the operation is attempted or **After** it has completed. This timing is crucial. A `BEFORE` trigger can, for example, modify the data that is about to be inserted or updated, or it can prevent the operation altogether. An `AFTER` trigger might perform logging or update other related tables based on the changes that just occurred.
*   A trigger can be configured to fire **For each row** affected by the DML statement (a row-level trigger), or **For each statement** regardless of how many rows it affects (a statement-level trigger). We'll see examples of both.

---
#### Basic Trigger Components

The slide shows the general syntax for creating a trigger:
`CREATE TRIGGER trigger_name ... EXECUTE FUNCTION trigger_function();`

Let's break down the components:
*   `CREATE TRIGGER trigger_name`: This names your trigger.
*   `[BEFORE|AFTER|INSTEAD OF]`: This specifies the *timing* of the trigger.
    *   `BEFORE`: Fires before the event.
    *   `AFTER`: Fires after the event.
    *   `INSTEAD OF`: This is special and used primarily with views. Instead of the DML operation happening on the view, the trigger function executes instead, allowing you to define custom behavior for updating complex views.
*   `[INSERT|UPDATE|DELETE]`: This specifies the DML *event* or events that will cause the trigger to fire. You can specify one or more (e.g., `INSERT OR UPDATE`).
*   `ON table_name`: This identifies the table (or view) to which this trigger is attached.
*   `[FOR EACH ROW|FOR EACH STATEMENT]`: This defines the *granularity*.
    *   `FOR EACH ROW`: The trigger function will be executed once for every row affected by the triggering DML statement.
    *   `FOR EACH STATEMENT`: The trigger function will be executed only once per DML statement, even if that statement affects multiple rows (or no rows).
*   `EXECUTE FUNCTION trigger_function();`: This is crucial. A trigger itself doesn't contain the procedural logic directly in its `CREATE TRIGGER` definition. Instead, it specifies the name of a special *trigger function* that will be executed when the trigger fires. This trigger function is a separate `PL/pgSQL` function that you must create, and it must return a special type `TRIGGER`.

So, creating a trigger is a two-step process: first, you create the trigger function, and then you create the trigger itself, linking it to the function, table, event, and timing.

---
<div class="page-break"></div>

### Trigger Events

Let's delve deeper into the options available when defining triggers.

#### Timing Options

The table on the slide summarizes the timing options we just discussed:

*   `BEFORE`: When you choose `BEFORE`, the trigger function executes *before* the actual insert, update, or delete operation is attempted on the table. A key capability of `BEFORE` triggers (especially `BEFORE FOR EACH ROW` triggers) is that they can inspect and even *modify* the data that is about to be written. For example, a `BEFORE INSERT` trigger could automatically populate a `created_at` timestamp column. It can also prevent the operation from happening by returning `NULL` (for row-level triggers) or raising an exception.

*   `AFTER`: With `AFTER`, the trigger function executes *after* the DML operation has successfully completed (but typically before the transaction commits, unless it's a constraint trigger with specific timing). `AFTER` triggers cannot modify the data that was just written by the triggering statement because the operation has already happened. They are often used for tasks like logging changes, updating aggregate tables, or initiating actions in other related tables.

*   `INSTEAD OF`: This timing is specifically for triggers on views, not tables. Views are virtual tables based on queries, and not all views are directly updatable. An `INSTEAD OF` trigger allows you to define exactly what should happen when an `INSERT`, `UPDATE`, or `DELETE` statement is issued against the view. The trigger function effectively *replaces* the original DML operation on the view with its own custom logic, which might involve updating one or more underlying base tables.

---
#### Operation Types

This table lists the DML operations that can fire a trigger:

*   `INSERT`: The trigger will fire when a new row is inserted into the table.
*   `UPDATE`: The trigger fires when an existing row in the table is modified. You can even make an `UPDATE` trigger fire only when specific columns are updated.
*   `DELETE`: The trigger fires when a row is deleted from the table.
*   `TRUNCATE`: The trigger fires when the `TRUNCATE TABLE` command is executed. `TRUNCATE` is a fast way to delete all rows from a table. Triggers for `TRUNCATE` can only be `FOR EACH STATEMENT`; they cannot be `FOR EACH ROW` because `TRUNCATE` doesn't process rows individually.

You can define a single trigger to fire for multiple event types, for example, `ON my_table FOR INSERT OR UPDATE`.

---
#### Details

This section clarifies the granularity of triggers:

*   `FOR EACH ROW`: If a trigger is defined with `FOR EACH ROW`, its associated trigger function will execute once for every single row that is affected by the triggering DML statement. For example, if an `UPDATE` statement modifies 100 rows, a `FOR EACH ROW` trigger will run 100 times. Row-level triggers have access to the data of the row being affected (through special `NEW` and `OLD` records, which we'll see soon).

*   `FOR EACH STATEMENT`: If a trigger is defined with `FOR EACH STATEMENT`, its function executes only once for the entire DML statement, regardless of how many rows are affected (even if zero rows are affected). Statement-level triggers do not have direct access to individual row data like `NEW` and `OLD`. They are useful for actions that need to happen once per operation, such as logging that an `UPDATE` attempt was made on a table.

The choice between `FOR EACH ROW` and `FOR EACH STATEMENT` depends entirely on what the trigger needs to accomplish.

---
<div class="page-break"></div>

### Trigger Function Structure

As we mentioned, the actual logic of a trigger resides in a separate `trigger function`.

#### Basic Template
Here's the basic structure of such a function in `PL/pgSQL`:

```sql
CREATE OR REPLACE FUNCTION trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger logic here
    RETURN NEW;  -- or OLD or NULL
END;
$$ LANGUAGE plpgsql;
```

Let's examine this structure:
*   `CREATE OR REPLACE FUNCTION trigger_function()`: This is a standard function definition. You give it a name.
*   `RETURNS TRIGGER`: This is critical. A function intended to be used by a trigger *must* be declared as `RETURNS TRIGGER`. It doesn't return a normal data type.
*   `AS $$ ... $$ LANGUAGE plpgsql;`: The body is `PL/pgSQL` code enclosed in dollar quotes.
*   `BEGIN ... END;`: This block contains the actual logic that will execute when the trigger fires.
*   `RETURN NEW; -- or OLD or NULL`: The return value of a trigger function is very important, especially for row-level `BEFORE` triggers.
    *   For `BEFORE FOR EACH ROW` triggers:
        *   Returning `NEW` (or a modified version of `NEW`) allows the DML operation to proceed with the (potentially modified) `NEW` row data.
        *   Returning `NULL` causes the DML operation for that specific row to be skipped silently.
    *   For `AFTER FOR EACH ROW` triggers, the return value is usually ignored, but it's good practice to return `NEW` (for `INSERT`/`UPDATE`) or `OLD` (for `DELETE`), or `NULL`.
    *   For statement-level triggers, the return value is also typically ignored, and `NULL` is often returned.

---
#### Special Trigger Variables

Inside a trigger function, `PL/pgSQL` provides several special variables that give context about the event that caused the trigger to fire. These are immensely useful:

*   `NEW`: In `FOR EACH ROW` triggers for `INSERT` and `UPDATE` operations, `NEW` is a special record variable that holds the new row data.
    *   For an `INSERT`, `NEW` contains the row as it would be after the insertion.
    *   For an `UPDATE`, `NEW` contains the row with the modifications as proposed by the `UPDATE` statement.
    *   In a `BEFORE` trigger, you can actually *change* the values in the `NEW` record (e.g., `NEW.column_name := 'some_value';`), and those changes will be what gets written to the table if the operation proceeds.

*   `OLD`: In `FOR EACH ROW` triggers for `UPDATE` and `DELETE` operations, `OLD` is a special record variable that holds the old row data.
    *   For an `UPDATE`, `OLD` contains the values of the row *before* the update.
    *   For a `DELETE`, `OLD` contains the values of the row that is about to be (or has just been) deleted.
    *   You cannot modify `OLD`.

*   `TG_OP`: This variable is a string that indicates the operation that fired the trigger. Its value will be `'INSERT'`, `'UPDATE'`, `'DELETE'`, or `'TRUNCATE'`. This is very useful if you have a single trigger function that handles multiple event types; you can use `IF TG_OP = 'INSERT' THEN ... ELSIF TG_OP = 'UPDATE' THEN ...` to perform different logic based on the operation.

*   `TG_TABLE_NAME`: This variable holds the name of the table on which the trigger fired. This can be useful for generic trigger functions that might be attached to multiple tables.

These variables are your primary tools for interacting with the data and context within a trigger function.

---
<div class="page-break"></div>

### Practical Examples

Let's look at how these concepts come together in some practical trigger examples.

#### Audit Log Trigger

A very common use case for triggers is to create an audit log, recording changes made to important data.
First, we need a table to store the audit information. The slide shows the creation of an `employee_audit` table:
```sql
CREATE TABLE employee_audit (
    operation CHAR(1),      -- e.g., 'U' for update, 'I' for insert
    employee_id INT,
    old_salary NUMERIC,
    new_salary NUMERIC,
    changed_by TEXT,        -- User who made the change
    change_time TIMESTAMP   -- When the change occurred
);
```
This table will store what operation happened, on which employee, what the old and new salary values were (if applicable), who made the change, and when.

---
Next, we create the **trigger function**, `log_salary_change()`:
```sql
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.salary <> OLD.salary THEN
        INSERT INTO employee_audit
        VALUES (
            'U',               -- Operation was an Update
            NEW.id,            -- Employee ID from the NEW record
            OLD.salary,        -- Old salary from the OLD record
            NEW.salary,        -- New salary from the NEW record
            current_user,      -- PostgreSQL built-in for current DB user
            now()              -- PostgreSQL built-in for current timestamp
        );
    END IF;
    RETURN NEW; -- For an AFTER UPDATE trigger, return value often ignored but NEW is fine.
                -- If this were a BEFORE trigger, returning NEW would be essential.
END;
$$ LANGUAGE plpgsql;
```
Let's analyze this function:
*   It `RETURNS TRIGGER`.
*   Inside the `BEGIN...END` block, it first checks two conditions:
    *   `IF TG_OP = 'UPDATE'`: This ensures the logic only runs if an `UPDATE` operation fired the trigger.
    *   `AND NEW.salary <> OLD.salary`: This is a crucial optimization. It only logs a change if the `salary` column *actually changed*. If an `UPDATE` statement touched the row but didn't modify the salary, this trigger won't insert an audit record for the salary. The `<>` operator means "not equal to."
*   If both conditions are true, it performs an `INSERT` into our `employee_audit` table, populating it with:
    *   `'U'` for the operation type.
    *   `NEW.id` for the employee's ID (assuming `id` is the primary key in the `employees` table and accessible via `NEW`).
    *   `OLD.salary` for the salary before the update.
    *   `NEW.salary` for the salary after the update.
    *   `current_user`: a built-in PostgreSQL variable that gives the database username performing the action.
    *   `now()`: a built-in PostgreSQL function that returns the current date and time.
*   `RETURN NEW;`: Since this is likely intended for an `AFTER UPDATE` trigger (as suggested by the attachment step next), the return value is less critical but returning `NEW` is conventional.

---
Finally, we **attach the trigger** to the `employees` table:
```sql
CREATE TRIGGER salary_audit
AFTER UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION log_salary_change();
```
*   `CREATE TRIGGER salary_audit`: Names the trigger.
*   `AFTER UPDATE ON employees`: It will fire *after* an `UPDATE` operation on the `employees` table.
*   `FOR EACH ROW`: It's a row-level trigger, so `log_salary_change()` will run for every updated employee row.
*   `EXECUTE FUNCTION log_salary_change();`: Specifies our trigger function.

Now, every time an employee's salary is updated in the `employees` table, a record of that change will be automatically inserted into the `employee_audit` table. This is a powerful way to maintain a history of data modifications.

---
<div class="page-break"></div>

#### 4.2 Data Validation Trigger

Triggers are excellent for enforcing complex business rules or data validation logic that might be difficult or cumbersome to express with simple table constraints. This example ensures that an employee must be at least 18 years old.

First, the **trigger function**, `validate_employee_age()`:
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
*   It `RETURNS TRIGGER`.
*   The core logic is an `IF` statement: `IF NEW.birth_date > CURRENT_DATE - INTERVAL '18 years' THEN`.
    *   `NEW.birth_date` refers to the birth date of the employee being inserted or updated.
    *   `CURRENT_DATE` is a PostgreSQL function that gives today's date.
    *   `INTERVAL '18 years'` represents a duration of 18 years.
    *   So, `CURRENT_DATE - INTERVAL '18 years'` calculates the date 18 years ago from today.
    *   If the employee's `birth_date` is *greater than* (i.e., more recent than) the date 18 years ago, it means they are younger than 18.
*   If the condition is true (employee is too young), `RAISE EXCEPTION 'Employee must be at least 18 years old';` is executed. This stops the `INSERT` or `UPDATE` operation and reports an error.
*   `RETURN NEW;`: If the employee is old enough, the exception is not raised, and `RETURN NEW` allows the operation to proceed with the (valid) `NEW` row data. This is crucial for a `BEFORE` trigger that intends to allow the operation.

---
Next, the **trigger definition**:
```sql
CREATE TRIGGER check_age
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION validate_employee_age();
```
*   `CREATE TRIGGER check_age`: Names the trigger.
*   `BEFORE INSERT OR UPDATE ON employees`: This trigger will fire *before* any `INSERT` or `UPDATE` operation on the `employees` table. Attaching it to `BEFORE` is important because we want to prevent invalid data from entering the table.
*   `FOR EACH ROW`: It applies to each row being inserted or updated.
*   `EXECUTE FUNCTION validate_employee_age();`: Links to our validation function.

With this trigger in place, the database will automatically prevent the creation or modification of employee records where the employee is not at least 18 years old.

---
<div class="page-break"></div>

#### 4.3 Derived Column Trigger

Sometimes, you have a column whose value can be automatically derived from other columns in the same row. Triggers can automate this. This example shows how to automatically populate a `full_name` column based on `first_name` and `last_name`.

First, the **trigger function**, `update_full_name()`:
```sql
CREATE OR REPLACE FUNCTION update_full_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_name := NEW.first_name || ' ' || NEW.last_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
*   It `RETURNS TRIGGER`.
*   The logic is straightforward: `NEW.full_name := NEW.first_name || ' ' || NEW.last_name;`
    *   It assigns a value to the `full_name` field of the `NEW` record.
    *   The value is constructed by concatenating (`||` is the string concatenation operator in PostgreSQL) the `NEW.first_name`, a space character (`' '`), and the `NEW.last_name`.
*   `RETURN NEW;`: This is very important. Since this will be a `BEFORE` trigger, we are modifying the `NEW` record (by setting `NEW.full_name`). By returning the modified `NEW` record, we ensure that these changes are written to the table when the `INSERT` or `UPDATE` operation proceeds.

---
Then, the **trigger definition**:
```sql
CREATE TRIGGER set_full_name
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_full_name();
```
*   `CREATE TRIGGER set_full_name`: Names the trigger.
*   `BEFORE INSERT OR UPDATE ON employees`: This trigger fires *before* an `INSERT` or `UPDATE` on the `employees` table. This timing is crucial because we want to set the `full_name` *before* the row is actually written to disk.
*   `FOR EACH ROW`: It applies to each row being inserted or updated.
*   `EXECUTE FUNCTION update_full_name();`: Links to our derivation function.

Now, whenever a new employee is inserted, or an existing employee's first or last name is updated, this trigger will automatically compute and populate the `full_name` column. This ensures data consistency and saves application developers from having to remember to do this concatenation manually.

(Note: PostgreSQL also offers "Generated Columns" as a more modern, and often preferred, way to handle derived columns directly in the table definition without explicit triggers for simple cases like this. However, triggers provide more flexibility for complex derivations.)

---
<div class="page-break"></div>

### Advanced Trigger Concepts

Beyond the basic examples, triggers offer more advanced capabilities.

#### Conditional Trigger Execution

Sometimes, you only want a trigger to fire if a specific condition related to the data change is met. You can achieve this using the `WHEN` clause directly in the `CREATE TRIGGER` statement.

The example shows:
```sql
CREATE TRIGGER conditional_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_status_change();
```
*   This creates a trigger named `conditional_trigger` that fires `BEFORE UPDATE ON orders FOR EACH ROW`.
*   The key part is the `WHEN (OLD.status IS DISTINCT FROM NEW.status)` clause.
    *   This condition is checked *before* the `log_status_change()` trigger function is even called.
    *   `OLD.status IS DISTINCT FROM NEW.status` is a PostgreSQL-specific way to check if the `status` column has actually changed. It correctly handles `NULL` values (unlike a simple `OLD.status <> NEW.status`, which would be false if both were `NULL`).
*   If and only if the `status` column is changing for a given row, then the `log_status_change()` function will be executed. If the `status` is not changing (even if other columns in the row are being updated), the trigger function will not run for that row.

This can be more efficient than putting the condition inside the trigger function itself, as it avoids the overhead of calling the function unnecessarily.

---
#### INSTEAD OF Triggers (for Views)

As mentioned earlier, `INSTEAD OF` triggers are used with views. Views are stored queries that look like tables, but they don't always store data directly. Some views, especially complex ones (e.g., involving joins, aggregations, or unions), are not inherently updatable. `INSTEAD OF` triggers provide a way to define what should happen when a DML statement (`INSERT`, `UPDATE`, or `DELETE`) is attempted on such a view.

First, a **view is created**:
```sql
CREATE VIEW employee_details AS
SELECT e.id, e.name, d.name as dept_name
FROM employees e JOIN departments d ON e.dept_id = d.id;
```
This view, `employee_details`, joins `employees` and `departments` to show employee ID, employee name, and department name. Trying to directly `UPDATE` this view might be problematic because it involves two base tables.

---
Next, an **`INSTEAD OF UPDATE` trigger function** is created, `update_employee_view()`:
```sql
CREATE OR REPLACE FUNCTION update_employee_view()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE employees SET name = NEW.name WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
*   This function assumes that when someone tries to update the `employee_details` view, they are primarily interested in updating the employee's name.
*   `UPDATE employees SET name = NEW.name WHERE id = NEW.id;`: It performs an actual `UPDATE` on the base `employees` table, setting the `name` column based on the `NEW.name` value that was attempted on the view, for the employee with `id = NEW.id`.
*   `RETURN NEW;`: The `NEW` record here represents the row as it would appear in the view *after* the intended update.

---
Finally, the **`INSTEAD OF` trigger is created**:
```sql
CREATE TRIGGER employee_view_update
INSTEAD OF UPDATE ON employee_details
FOR EACH ROW EXECUTE FUNCTION update_employee_view();
```
*   `INSTEAD OF UPDATE ON employee_details`: This tells PostgreSQL that if someone tries to `UPDATE` the `employee_details` view, then *instead of* attempting the default update mechanism (which might fail), it should execute the `update_employee_view()` function.
*   `FOR EACH ROW`: The trigger function will handle each row targeted by the update on the view.

Now, if a user issues `UPDATE employee_details SET name = 'New Name' WHERE id = 123;`, the `employee_view_update` trigger will fire, and the `update_employee_view()` function will translate this into an update on the underlying `employees` table. This makes the view behave as if it were directly updatable for the `name` field.

---
#### Statement-Level Trigger

We've mostly focused on row-level triggers. Let's look at a statement-level trigger, which fires once per SQL statement. These are useful when you don't need to act on individual rows but rather on the event of the statement itself.

The **trigger function**, `log_bulk_operations()`:
```sql
CREATE OR REPLACE FUNCTION log_bulk_operations()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO operation_log -- (Assuming an operation_log table exists)
    VALUES (TG_TABLE_NAME, TG_OP, current_user, now());
    RETURN NULL; -- For statement-level AFTER triggers, return value is ignored. NULL is fine.
END;
$$ LANGUAGE plpgsql;
```
*   This function inserts a single row into an `operation_log` table.
*   It logs:
    *   `TG_TABLE_NAME`: The name of the table on which the operation occurred.
    *   `TG_OP`: The type of operation (`'INSERT'`, `'UPDATE'`, `'DELETE'`).
    *   `current_user`: The user who executed the statement.
    *   `now()`: The timestamp of the operation.
*   `RETURN NULL;` is appropriate here as statement-level triggers don't deal with `NEW` or `OLD` row data.

---
The **trigger definition**:
```sql
CREATE TRIGGER track_bulk_changes
AFTER INSERT OR UPDATE OR DELETE ON employees
FOR EACH STATEMENT EXECUTE FUNCTION log_bulk_operations();
```
*   `AFTER INSERT OR UPDATE OR DELETE ON employees`: The trigger fires after any `INSERT`, `UPDATE`, or `DELETE` statement on the `employees` table.
*   `FOR EACH STATEMENT`: This is key. The `log_bulk_operations()` function will run only *once* for each such statement, regardless of whether that statement affected 0, 1, or 1000 rows.

This type of trigger is useful for high-level auditing, like "User X attempted an update on the employees table at time Y," without needing the details of each affected row.

---
<div class="page-break"></div>

### Trigger Management

Once you have triggers in your database, you'll need ways to manage them.

#### Viewing Triggers

How do you find out what triggers exist in your database? You can query the information schema. The `information_schema` is a standard set of views that provide metadata about your database objects.

The slide shows a query:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers;
```
*   This query selects the `trigger_name` (name of the trigger), `event_manipulation` (e.g., `INSERT`, `UPDATE`, `DELETE`), and `event_object_table` (the table the trigger is on).
*   Querying `information_schema.triggers` will list all triggers you have permission to see. You can add a `WHERE` clause to filter for triggers on a specific table or with a specific name.

---
#### Disabling/Enabling Triggers

Sometimes, during data loading operations or maintenance, you might want to temporarily disable a trigger to prevent it from firing. You can then re-enable it later.

*   To **disable** a trigger:
    ```sql
    ALTER TABLE employees DISABLE TRIGGER salary_audit;
    ```
    This command tells PostgreSQL to make the `salary_audit` trigger on the `employees` table inactive. It will not fire until it's enabled again.

*   To **enable** a trigger:
    ```sql
    ALTER TABLE employees ENABLE TRIGGER salary_audit;
    ```
    This reactivates the specified trigger.

You can also use `DISABLE TRIGGER ALL` or `ENABLE TRIGGER ALL` on a table to affect all user-defined triggers on that table.

---
#### Dropping Triggers

If a trigger is no longer needed, you can remove it from the database.

```sql
DROP TRIGGER IF EXISTS salary_audit ON employees;
```
*   `DROP TRIGGER salary_audit ON employees;` removes the `salary_audit` trigger from the `employees` table.
*   The `IF EXISTS` clause is optional but good practice. It prevents an error if you try to drop a trigger that doesn't actually exist.

Remember that dropping a trigger does *not* drop the trigger function it uses. If the trigger function is no longer needed by any other triggers, you would have to drop it separately using `DROP FUNCTION function_name();`.

---
### 7. Common Use Cases

We've seen several examples, but let's summarize some of the most common applications for triggers:

1.  **Audit Logging:** As demonstrated with the `salary_audit` trigger, this involves tracking changes to data, often for security, compliance, or historical purposes. Who changed what, and when?

2.  **Data Validation:** Enforcing complex business rules that go beyond simple `CHECK` constraints or `FOREIGN KEY` constraints. The age validation trigger was an example.

3.  **Derived Columns:** Automatically maintaining computed values, like the `full_name` example. This ensures data consistency and can simplify application logic.

4.  **Cross-Table Synchronization:** Keeping related data in different tables consistent. For instance, if you update a summary value in one table, a trigger might automatically update related detail records in another table, or vice-versa (though this needs careful design to avoid infinite loops or performance issues).

5.  **Security Enforcement:** Implementing fine-grained, row-level security policies. For example, a trigger could prevent certain users from deleting rows unless specific conditions are met, or it could restrict updates to certain columns based on user roles.

Triggers are versatile, but they should be used judiciously, as they can add complexity and overhead.

---
<div class="page-break"></div>

### 8. Performance Considerations

While powerful, triggers can impact database performance if not designed and used carefully. Here are some key considerations:

1.  **Minimize Trigger Complexity:** Keep the logic within your trigger functions as simple and efficient as possible. Complex calculations, extensive queries, or operations on large datasets within a trigger function that fires frequently (especially row-level triggers) can significantly slow down your DML operations.

2.  **Avoid Nested Triggers:** Be cautious about triggers that cause actions which, in turn, fire other triggers (which might fire yet more triggers). This is called "nested triggers" or "cascading triggers." If not carefully controlled, this can lead to complex, hard-to-debug behavior and severe performance degradation, or even infinite loops if a trigger ends up indirectly causing itself to fire again.

3.  **Consider Statement-Level:** If your trigger logic doesn't absolutely need to operate on each individual row, consider using a statement-level trigger instead of a row-level trigger. Statement-level triggers fire only once per statement, reducing the overhead significantly, especially for DML statements that affect many rows.

4.  **Benchmark Impact:** Always test the performance impact of your triggers. Measure the execution time of DML operations on the relevant tables with and without the trigger enabled. This will help you understand the overhead introduced by the trigger and identify any performance bottlenecks. Use tools like `EXPLAIN ANALYZE` for the DML statements to see how triggers affect the execution plan and timing.

Performance is a critical aspect of trigger design.

---
### 9. Best Practices

To ensure your triggers are effective, maintainable, and don't cause undue problems, follow these best practices:

1.  **Name Clearly:** Use descriptive names for both your triggers and your trigger functions. A name like `log_salary_changes_after_update_on_employees` is much more informative than `trg1` or `myfunc`. This makes it easier to understand their purpose when you or someone else reviews the database schema later. The slide example `log_salary_changes` is a good start for a function name.

2.  **Document Triggers:** Comment your trigger functions! Explain what the trigger is supposed to do, why it's needed, any assumptions it makes, and how it works. Good comments are invaluable for future maintenance and troubleshooting.

3.  **Handle Errors:** Use `EXCEPTION` blocks within your trigger functions to catch and handle potential errors gracefully. An unhandled error in a trigger can cause the entire DML statement to fail, which might not always be the desired behavior. Logging errors or taking alternative actions can make your system more robust.

4.  **Test Thoroughly:** Triggers can have far-reaching effects. Test them rigorously with various scenarios, including valid data, invalid data (to ensure validation triggers work), edge cases, and bulk operations. Verify that they behave as expected and don't introduce unintended side effects or performance issues.

Finally, the concluding thought on the slide is very important: "Triggers provide powerful automation capabilities but should be used judiciously to maintain database performance and clarity." They are a sharp tool; use them wisely and with a clear understanding of their implications.

That concludes our overview of triggers in PL/pgSQL. Are there any questions at this point?