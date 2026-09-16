<?php

$mcqs = [
    // 1. HTML, CSS & Modern Web Design (1-10)
    [
        1, "HTML & Web Design", "Easy",
        "Which HTML5 element is used to specify a footer for a document or section?",
        "<bottom>", "<footer>", "<section-footer>", "<foot>",
        "B", "The <footer> tag defines a footer for a document or section, typically containing author, copyright, or contact info."
    ],
    [
        2, "HTML & Web Design", "Easy",
        "What does the CSS 'box-sizing: border-box' property do?",
        "Excludes padding and border from the element total width",
        "Includes padding and border in the element total width and height",
        "Adds an extra margin around the border",
        "Renders a 3D box shadow around the element",
        "B", "'border-box' ensures that the width and height properties include content, padding, and borders."
    ],
    [
        3, "HTML & Web Design", "Medium",
        "In CSS Flexbox, which property aligns items along the cross axis?",
        "justify-content", "align-items", "flex-direction", "align-content",
        "B", "'align-items' controls alignment along the cross axis, whereas 'justify-content' aligns along the main axis."
    ],
    [
        4, "HTML & Web Design", "Medium",
        "Which CSS Grid property specifies the size of grid columns?",
        "grid-template-columns", "grid-column-gap", "grid-auto-flow", "column-count",
        "A", "'grid-template-columns' defines the number and widths of columns in a CSS Grid container."
    ],
    [
        5, "HTML & Web Design", "Easy",
        "What is the primary purpose of the 'alt' attribute on an <img> tag in HTML?",
        "To provide a tooltip when hovered",
        "To supply alternative text for accessibility and when the image fails to load",
        "To set the alignment of the image",
        "To specify the image resolution",
        "B", "The 'alt' attribute provides alternative text for screen readers and search engines, and displays when images fail to render."
    ],
    [
        6, "HTML & Web Design", "Medium",
        "Which CSS unit is relative to the font-size of the root (<html>) element?",
        "em", "rem", "vh", "%",
        "B", "'rem' stands for 'Root EM' and is always calculated relative to the root <html> element font-size."
    ],
    [
        7, "HTML & Web Design", "Hard",
        "What happens when you apply 'position: sticky' to an element in CSS?",
        "It stays fixed relative to the viewport at all times",
        "It toggles between relative and fixed depending on scroll position within its container",
        "It removes the element from normal document flow permanently",
        "It anchors the element to the bottom of the body",
        "B", "'position: sticky' behaves like 'relative' until a given scroll offset is reached, then acts like 'fixed' within its parent."
    ],
    [
        8, "HTML & Web Design", "Medium",
        "What is the default display property of a <div> element?",
        "inline", "inline-block", "block", "flex",
        "C", "Standard <div> elements default to 'display: block', taking up the full available container width."
    ],
    [
        9, "HTML & Web Design", "Easy",
        "Which meta tag is required in HTML5 to ensure responsive mobile rendering?",
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
        "<meta name='screen' content='mobile-first'>",
        "<meta name='responsive' content='true'>",
        "<meta name='device' content='auto'>",
        "A", "The viewport meta tag configures the viewport width and initial scaling for mobile browsers."
    ],
    [
        10, "HTML & Web Design", "Medium",
        "Which CSS pseudo-class matches an element when it is actively being clicked?",
        ":hover", ":focus", ":active", ":visited",
        "C", "The ':active' pseudo-class represents an element being activated by the user (e.g. while mouse button is held down)."
    ],

    // 2. JavaScript (ES6+) & TypeScript (11-25)
    [
        11, "JavaScript & TypeScript", "Easy",
        "Which keyword declares a block-scoped variable that can be reassigned in JavaScript?",
        "var", "let", "const", "static",
        "B", "'let' declares block-scoped variables that can be updated/reassigned, unlike 'const'."
    ],
    [
        12, "JavaScript & TypeScript", "Medium",
        "What is the output of 'typeof null' in JavaScript?",
        "'null'", "'undefined'", "'object'", "'boolean'",
        "C", "Due to a legacy implementation detail in JavaScript, 'typeof null' returns 'object'."
    ],
    [
        13, "JavaScript & TypeScript", "Medium",
        "What does the Array.prototype.map() method return in JavaScript?",
        "The modified original array",
        "A new array populated with the results of calling a provided function on every element",
        "A single accumulated value",
        "A boolean indicating if all elements passed a test",
        "B", "map() creates a new array by executing a transform function on every item without mutating the source array."
    ],
    [
        14, "JavaScript & TypeScript", "Easy",
        "Which operator is used for optional chaining in modern JavaScript / TypeScript?",
        "??", "?.", "||", "::",
        "B", "The '?.' operator reads values deep within a chain of connected objects without causing an error if a reference is nullish."
    ],
    [
        15, "JavaScript & TypeScript", "Medium",
        "What is the purpose of the nullish coalescing operator (??)?",
        "Returns the right-hand operand only when the left-hand operand is null or undefined",
        "Returns the right-hand operand when the left-hand operand is falsy (including 0 and '')",
        "Compares two variables for strict equality",
        "Negates a boolean condition",
        "A", "'??' treats 0 and '' as valid values, only falling back if the value is strictly null or undefined."
    ],
    [
        16, "JavaScript & TypeScript", "Hard",
        "What is a 'Closure' in JavaScript?",
        "A method to close browser tabs programmatically",
        "A function bundled together with references to its lexical environment",
        "A syntax error caused by unclosed curly braces",
        "An asynchronous promise resolver",
        "B", "A closure gives an inner function access to an outer function scope even after the outer function has finished executing."
    ],
    [
        17, "JavaScript & TypeScript", "Medium",
        "What does Promise.all() do when one of the passed promises rejects?",
        "It ignores the rejected promise and returns remaining results",
        "It immediately rejects with the error of the first rejected promise",
        "It retries the rejected promise up to 3 times",
        "It waits for all promises then returns null",
        "B", "Promise.all follows an all-or-nothing (fail-fast) behavior, rejecting immediately if any input promise rejects."
    ],
    [
        18, "JavaScript & TypeScript", "Easy",
        "In TypeScript, which type represents a value that will never occur (e.g. a function that always throws)?",
        "void", "any", "never", "unknown",
        "C", "The 'never' type represents values that never occur, such as functions that throw exceptions or infinite loops."
    ],
    [
        19, "JavaScript & TypeScript", "Medium",
        "What is the difference between 'interface' and 'type' in TypeScript?",
        "Interfaces can be merged through declaration merging; type aliases cannot",
        "Types cannot define object structures",
        "Interfaces cannot extend other interfaces",
        "Types are only available during runtime",
        "A", "TypeScript interfaces support declaration merging and open extending, whereas type aliases cannot be reopened."
    ],
    [
        20, "JavaScript & TypeScript", "Hard",
        "What is the Event Loop in JavaScript responsible for?",
        "Handling compilation of TypeScript into JavaScript",
        "Executing tasks, collecting events, and running queued sub-tasks from the microtask/macrotask queues",
        "Allocating heap memory to garbage collectors",
        "Managing DOM CSS animations only",
        "B", "The Event Loop continuously monitors the Call Stack and moves tasks from callback/promise queues when the stack is empty."
    ],
    [
        21, "JavaScript & TypeScript", "Medium",
        "Which method converts a JavaScript object into a JSON string?",
        "JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.encode()",
        "B", "JSON.stringify() serializes a JavaScript object or array into a standard JSON string."
    ],
    [
        22, "JavaScript & TypeScript", "Easy",
        "What does the spread operator (...) do on an array?",
        "Sorts the array alphabetically",
        "Expands the array elements in places where zero or more arguments or elements are expected",
        "Removes duplicate values from the array",
        "Reverses the array in place",
        "B", "The spread syntax (...) allows iterable elements like arrays or objects to be expanded inline."
    ],
    [
        23, "JavaScript & TypeScript", "Medium",
        "In TypeScript, what does the 'readonly' modifier do on a property?",
        "Prevents the property from being read",
        "Prevents assignments to the property outside the constructor",
        "Hides the property during JSON serialization",
        "Encrypts the property in memory",
        "B", "'readonly' makes a property immutable after its initial creation or constructor assignment."
    ],
    [
        24, "JavaScript & TypeScript", "Hard",
        "What is the difference between '==' and '===' in JavaScript?",
        "'==' performs type coercion before comparison; '===' checks both value and type strictly",
        "'===' performs type coercion; '==' is strict",
        "'==' is only used for numbers; '===' is used for strings",
        "There is no difference in ES6",
        "A", "The loose equality operator (==) converts operands to a common type before comparison, while strict (===) does not."
    ],
    [
        25, "JavaScript & TypeScript", "Medium",
        "Which built-in object method returns an array of an object's enumerable property names?",
        "Object.values()", "Object.entries()", "Object.keys()", "Object.getNames()",
        "C", "Object.keys() returns an array of a given object's own enumerable string-keyed property names."
    ],

    // 3. React.js & Next.js (26-40)
    [
        26, "React & Next.js", "Easy",
        "Which React hook is used to perform side effects in functional components?",
        "useState", "useEffect", "useMemo", "useRef",
        "B", "useEffect handles side effects such as data fetching, subscriptions, timers, and manual DOM manipulations."
    ],
    [
        27, "React & Next.js", "Medium",
        "What is the primary benefit of the 'useCallback' hook in React?",
        "To memoize expensive calculations",
        "To cache a function definition between re-renders to prevent unnecessary child re-renders",
        "To trigger asynchronous state updates",
        "To create mutable refs",
        "B", "useCallback memoizes callback functions so child components relying on reference equality avoid re-rendering."
    ],
    [
        28, "React & Next.js", "Medium",
        "In React, why must list items have a unique 'key' prop?",
        "To style list items using CSS selectors",
        "To help React identify which items have changed, been added, or been removed during reconciliation",
        "To ensure items are sorted in alphabetical order",
        "To bind event handlers automatically",
        "B", "Keys give elements a stable identity inside lists, allowing React's Virtual DOM diffing algorithm to perform efficient updates."
    ],
    [
        29, "React & Next.js", "Easy",
        "In Next.js Pages router, which directory maps file names directly to URL routes?",
        "/src/components", "/pages", "/public", "/routes",
        "B", "In Next.js Pages router, any .tsx/.js file inside the /pages directory automatically becomes a public route."
    ],
    [
        30, "React & Next.js", "Hard",
        "What is the difference between getServerSideProps (SSR) and getStaticProps (SSG) in Next.js?",
        "SSR renders HTML on every client request; SSG pre-renders HTML at build time",
        "SSG runs on every request; SSR only runs at build time",
        "SSR is only used for static images",
        "SSG cannot fetch data from external APIs",
        "A", "getStaticProps generates static HTML at build time for high CDN caching, whereas getServerSideProps renders dynamically per request."
    ],
    [
        31, "React & Next.js", "Medium",
        "What hook would you use to store a mutable value that does NOT cause a component re-render when changed?",
        "useState", "useRef", "useReducer", "useContext",
        "B", "useRef returns a mutable ref object whose .current property can be modified without triggering a re-render."
    ],
    [
        32, "React & Next.js", "Medium",
        "What is React Context primarily used for?",
        "Direct DOM manipulation",
        "Passing data deeply through the component tree without prop drilling",
        "Server-side caching only",
        "Handling database migrations",
        "B", "React Context provides a way to share values like themes, auth user state, or settings without passing props through every level."
    ],
    [
        33, "React & Next.js", "Easy",
        "What is JSX in React?",
        "A database query language for React",
        "A syntax extension for JavaScript that allows writing HTML-like code inside JS",
        "A CSS preprocessor",
        "A specialized JSON serializer",
        "B", "JSX stands for JavaScript XML, allowing developers to write declarative HTML-style elements in React components."
    ],
    [
        34, "React & Next.js", "Medium",
        "In Next.js, how do you handle SEO meta tags dynamically in Pages router?",
        "By importing Head from 'next/head' and placing <title> and <meta> tags inside it",
        "By editing package.json",
        "By creating an seo.html file in /public",
        "Next.js does not support dynamic SEO",
        "A", "The 'next/head' component allows appending custom <title>, <meta>, and <link> elements to the page <head>."
    ],
    [
        35, "React & Next.js", "Hard",
        "What does React.memo() do?",
        "Memoizes the return value of an expensive mathematical function",
        "Higher-order component that skips re-rendering a component if its props have not changed",
        "Stores component state in browser localStorage",
        "Forces a component to re-render every 5 seconds",
        "B", "React.memo is a performance optimization tool that memoizes the rendered output of a functional component."
    ],
    [
        36, "React & Next.js", "Medium",
        "Which hook in Next.js is used to access route parameters and query strings?",
        "useParams", "useRouter", "useNavigation", "usePath",
        "B", "The useRouter() hook from 'next/router' gives access to router.query, router.pathname, router.asPath, and navigation methods."
    ],
    [
        37, "React & Next.js", "Easy",
        "What is the purpose of the 'Link' component from 'next/link'?",
        "To connect to an external CSS stylesheet",
        "To enable client-side route transitions without full page refreshes",
        "To open external websites in a new window only",
        "To load Google Fonts asynchronously",
        "B", "next/link performs instant client-side routing with pre-fetching for optimal performance."
    ],
    [
        38, "React & Next.js", "Medium",
        "What will happen if you update state directly without using the setState setter (e.g. count = 5)?",
        "React will immediately re-render with the new count",
        "React will not detect the change and will not trigger a re-render",
        "It throws a compilation error",
        "It resets the whole component to initial state",
        "B", "State in React must be treated as immutable; mutating variables directly bypasses React's lifecycle and re-rendering engine."
    ],
    [
        39, "React & Next.js", "Hard",
        "What is Hydration in Next.js / React SSR?",
        "Clearing local storage before loading pages",
        "The process where React attaches event listeners and interactivity to server-rendered HTML in the browser",
        "Compressing images before sending them to the client",
        "Connecting React directly to a MySQL database",
        "B", "Hydration is the client-side process where React takes static HTML sent by the server and boots up the interactive Virtual DOM."
    ],
    [
        40, "React & Next.js", "Medium",
        "What library is standard for data fetching with cache revalidation in Next.js client components?",
        "Redux Thunk", "SWR / TanStack Query", "jQuery AJAX", "Lodash",
        "B", "SWR ('stale-while-revalidate') and TanStack Query provide automatic caching, deduplication, and real-time focus revalidation."
    ],

    // 4. PHP & Laravel Framework (41-55)
    [
        41, "PHP & Laravel", "Easy",
        "What is the CLI command-line interface tool bundled with Laravel called?",
        "Composer", "Artisan", "NPM", "Vite",
        "B", "Artisan is Laravel's built-in command-line tool providing helpful commands for migrations, controllers, seeding, and queues."
    ],
    [
        42, "PHP & Laravel", "Easy",
        "Which ORM (Object-Relational Mapper) is built into the Laravel framework?",
        "Doctrine", "Eloquent", "Hibernate", "Prisma",
        "B", "Eloquent ORM provides an ActiveRecord implementation for interacting with relational database tables as PHP classes."
    ],
    [
        43, "PHP & Laravel", "Medium",
        "In Laravel, which middleware is responsible for authenticating API requests via Sanctum?",
        "auth:sanctum", "api:verified", "sanctum:guard", "jwt.auth",
        "A", "The 'auth:sanctum' middleware validates incoming Bearer API tokens generated by Laravel Sanctum."
    ],
    [
        44, "PHP & Laravel", "Medium",
        "What is the primary purpose of Database Migrations in Laravel?",
        "To backup database tables to cloud storage",
        "Version control for the database schema, allowing teams to modify and share application schemas",
        "To convert SQL queries into MongoDB documents",
        "To automatically generate frontend UI forms",
        "B", "Migrations act like version control for databases, allowing programmatic creation, modification, and rollback of tables."
    ],
    [
        45, "PHP & Laravel", "Hard",
        "What is the N+1 query problem in Eloquent and how do you solve it?",
        "Executing too many migrations; solved by running migrate:fresh",
        "Executing one query for parent records and N queries for related child records; solved using Eager Loading with with()",
        "A syntax error in SQL joins; solved using raw DB queries",
        "A memory leak in queues; solved by restarting workers",
        "B", "The N+1 problem occurs when accessing relations inside a loop; Eager Loading (Model::with('relation')->get()) solves it in 2 queries."
    ],
    [
        46, "PHP & Laravel", "Medium",
        "Which HTTP status code should a Laravel API return when an unauthenticated user tries to access a protected route?",
        "200 OK", "401 Unauthorized", "403 Forbidden", "500 Internal Error",
        "B", "HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials (token missing or expired)."
    ],
    [
        47, "PHP & Laravel", "Medium",
        "In Laravel, what is a 'Form Request' class used for?",
        "Rendering HTML form inputs with Blade",
        "Encapsulating complex authorization and validation logic away from the controller",
        "Handling multipart file uploads only",
        "Sending outbound email forms to users",
        "B", "Form Requests are custom request classes that contain validation rules and authorize logic before controller actions execute."
    ],
    [
        48, "PHP & Laravel", "Easy",
        "Which directory in a Laravel project contains all API and web route definitions?",
        "/app/Http", "/routes", "/config", "/resources",
        "B", "The '/routes' folder holds 'api.php', 'web.php', 'console.php', and 'channels.php'."
    ],
    [
        49, "PHP & Laravel", "Medium",
        "What does the 'php artisan migrate:fresh --seed' command do?",
        "Refreshes composer packages and builds assets",
        "Drops all tables from the database, runs all migrations from scratch, and executes database seeders",
        "Backs up all data into an SQL dump file",
        "Generates new controller classes",
        "B", "migrate:fresh completely cleans the database schema, re-runs all migration files, and populates initial records via seeders."
    ],
    [
        50, "PHP & Laravel", "Hard",
        "What is Dependency Injection in Laravel's Service Container?",
        "Importing CSS files into Blade templates",
        "The pattern of injecting class dependencies via constructors or methods rather than hardcoding them",
        "Injecting JavaScript scripts into HTML responses",
        "A type of database injection attack",
        "B", "Laravel's Service Container automatically resolves and injects class instances (type-hinted in constructors or controller methods)."
    ],
    [
        51, "PHP & Laravel", "Medium",
        "How do you define a One-to-Many relationship on a User model in Eloquent?",
        "public function tasks() { return \$this->hasMany(Task::class); }",
        "public function tasks() { return \$this->belongsTo(Task::class); }",
        "public function tasks() { return \$this->hasOne(Task::class); }",
        "public function tasks() { return \$this->manyToMany(Task::class); }",
        "A", "The 'hasMany()' relationship method defines that a single parent record owns multiple child records in another table."
    ],
    [
        52, "PHP & Laravel", "Easy",
        "In PHP, which superglobal array contains files uploaded via HTTP POST?",
        "\$_POST", "\$_FILES", "\$_REQUEST", "\$_ENV",
        "B", "\$_FILES holds all file metadata (name, tmp_name, size, error, type) for multipart/form-data uploads."
    ],
    [
        53, "PHP & Laravel", "Medium",
        "What is the purpose of Laravel's RateLimiter / Throttle middleware on login routes?",
        "To speed up database indexing",
        "To prevent brute-force attacks by restricting the number of requests a client can make in a given timeframe",
        "To limit file upload sizes to 10MB",
        "To throttle CPU core usage",
        "B", "Rate limiting restricts the frequency of login attempts (e.g. 5 attempts per minute) to protect against credential stuffing."
    ],
    [
        54, "PHP & Laravel", "Hard",
        "What is a Laravel 'Job' when used with Queues?",
        "A background task that is pushed to a queue (Redis/Database) and processed asynchronously by workers",
        "A scheduled cron job running once a month",
        "A job posting record in the HRMS database",
        "An artisan command executed in development",
        "A", "Queue Jobs offload time-consuming tasks (like sending emails or generating PDFs) to background workers for fast API response times."
    ],
    [
        55, "PHP & Laravel", "Medium",
        "Which PHP function securely hashes a password using bcrypt?",
        "md5()", "sha1()", "password_hash() / Hash::make()", "base64_encode()",
        "C", "password_hash() in PHP and Hash::make() in Laravel use strong one-way hashing algorithms (Bcrypt/Argon2) with automatic salting."
    ],

    // 5. Databases, SQL & Data Modeling (56-70)
    [
        56, "Database & SQL", "Easy",
        "Which SQL clause is used to filter records returned by a SELECT query?",
        "ORDER BY", "GROUP BY", "WHERE", "HAVING",
        "C", "The WHERE clause filters rows based on specified conditions before any grouping or sorting occurs."
    ],
    [
        57, "Database & SQL", "Medium",
        "What is the difference between WHERE and HAVING in SQL?",
        "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY",
        "HAVING is used for string values; WHERE is used for integers",
        "WHERE is only used in DELETE statements",
        "There is no difference in MySQL",
        "A", "WHERE filters individual rows before grouping, while HAVING filters group summaries after aggregate functions (COUNT, SUM, AVG)."
    ],
    [
        58, "Database & SQL", "Easy",
        "What is a PRIMARY KEY in a relational database?",
        "A column that allows duplicate values for fast indexing",
        "A column (or set of columns) that uniquely identifies each row in a table and cannot contain NULL",
        "A password used to connect to MySQL",
        "An encrypted foreign reference",
        "B", "A primary key uniquely identifies every record in a table and automatically enforces uniqueness and NOT NULL constraints."
    ],
    [
        59, "Database & SQL", "Medium",
        "What does an INNER JOIN return in SQL?",
        "All rows from the left table regardless of matches",
        "Only rows that have matching values in both joined tables",
        "All rows from both tables including unmatched ones",
        "Only rows from the right table",
        "B", "An INNER JOIN selects records that have matching values in both tables based on the ON condition."
    ],
    [
        60, "Database & SQL", "Hard",
        "What are the ACID properties in database transaction management?",
        "Atomicity, Consistency, Isolation, Durability",
        "Array, Column, Index, Database",
        "Authentication, Cryptography, Integrity, Decryption",
        "Asynchronous, Concurrent, Indexed, Distributed",
        "A", "ACID guarantees that database transactions are processed reliably (Atomic, Consistent state, Isolated concurrency, Durable storage)."
    ],
    [
        61, "Database & SQL", "Medium",
        "What is database Normalization (e.g. 1NF, 2NF, 3NF)?",
        "The process of organizing data to reduce redundancy and improve data integrity",
        "Increasing duplicate tables for backup",
        "Encrypting table columns with SHA-256",
        "Converting relational tables into NoSQL JSON",
        "A", "Normalization minimizes data duplication and dependency anomalies by dividing large tables into smaller related tables."
    ],
    [
        62, "Database & SQL", "Medium",
        "Which index type is best suited for accelerating equality and range queries on sorted columns?",
        "B-Tree Index", "Hash Index", "Spatial Index", "Full-Text Index",
        "A", "B-Tree (Balanced Tree) indexes are the default in relational databases (MySQL/PostgreSQL) and support fast lookups, range scans, and sorting."
    ],
    [
        63, "Database & SQL", "Easy",
        "Which SQL command removes all rows from a table quickly without logging individual row deletions?",
        "DELETE FROM", "TRUNCATE TABLE", "DROP TABLE", "REMOVE",
        "B", "TRUNCATE TABLE removes all rows and resets auto-increment counters much faster than DELETE because it deallocates data pages."
    ],
    [
        64, "Database & SQL", "Medium",
        "What is a FOREIGN KEY constraint used for?",
        "To encrypt sensitive credit card numbers",
        "To enforce referential integrity between columns in two tables",
        "To grant database permissions to foreign users",
        "To connect to an external third-party API",
        "B", "A foreign key points to a primary key in another table, preventing invalid data from being inserted and enforcing relationships."
    ],
    [
        65, "Database & SQL", "Hard",
        "What is the purpose of Database Sharding?",
        "Horizontal partitioning that splits a large database across multiple physical server instances",
        "Creating read-only replicas in the same data center",
        "Compressing database backup files into ZIP format",
        "Converting SQL schemas into CSV files",
        "A", "Sharding distributes data horizontally across multiple database nodes to scale out write throughput and storage capacity."
    ],
    [
        66, "Database & SQL", "Easy",
        "Which SQL aggregate function counts the total number of rows matching a criteria?",
        "SUM()", "COUNT()", "AVG()", "TOTAL()",
        "B", "COUNT(*) or COUNT(column) returns the number of rows that match the query's filter criteria."
    ],
    [
        67, "Database & SQL", "Medium",
        "What is the result of a LEFT JOIN if a row in the left table has no matching row in the right table?",
        "The row is dropped from the result set",
        "The row is included with NULL values for all columns from the right table",
        "The query throws an SQL syntax error",
        "It duplicates the previous row",
        "B", "A LEFT JOIN returns all records from the left table; unmatched right table fields are populated with NULL."
    ],
    [
        68, "Database & SQL", "Medium",
        "What is the purpose of an SQL Transaction (BEGIN, COMMIT, ROLLBACK)?",
        "To execute multiple operations as a single unit of work that either all succeed or all fail",
        "To speed up SELECT queries by 50%",
        "To log user login timestamps",
        "To generate automated PDF reports",
        "A", "Transactions ensure atomicity; if any query fails inside the block, a ROLLBACK reverts all changes to keep data consistent."
    ],
    [
        69, "Database & SQL", "Hard",
        "In relational databases, what is an 'Index Cardinality'?",
        "The number of physical CPU cores used to index a table",
        "The uniqueness of values in a column (ratio of distinct values to total rows)",
        "The number of foreign keys connected to the table",
        "The size of the table in gigabytes",
        "B", "High cardinality means a column has mostly unique values (like email or UUID), making it a high-efficiency candidate for indexing."
    ],
    [
        70, "Database & SQL", "Easy",
        "Which SQL clause is used to sort the result-set in descending order?",
        "ORDER BY column ASC", "ORDER BY column DESC", "SORT BY DESC", "GROUP BY column DESC",
        "B", "ORDER BY column DESC sorts output rows from highest to lowest (or Z to A)."
    ],

    // 6. Python, AI & Data Science (71-80)
    [
        71, "Python & AI/ML", "Easy",
        "Which data structure in Python is mutable and ordered?",
        "tuple", "list", "set", "frozenset",
        "B", "Lists (e.g. [1, 2, 3]) are ordered sequences that can be modified in-place, unlike immutable tuples."
    ],
    [
        72, "Python & AI/ML", "Medium",
        "Which Python library is the industry standard for fast multidimensional array manipulations?",
        "Pandas", "NumPy", "Matplotlib", "Flask",
        "B", "NumPy provides high-performance N-dimensional array objects and mathematical operations implemented in C."
    ],
    [
        73, "Python & AI/ML", "Medium",
        "In Machine Learning, what is 'Supervised Learning'?",
        "Training algorithms without any target labels",
        "Training a model on labeled input-output data pairs to predict outcomes on unseen data",
        "Training models exclusively using reinforcement rewards",
        "Automating database indexing",
        "B", "Supervised learning algorithms (like Linear Regression, Random Forest, SVM) learn mapping functions from labeled training datasets."
    ],
    [
        74, "Python & AI/ML", "Easy",
        "Which Python library is most widely used for tabular data analysis and DataFrames?",
        "TensorFlow", "Pandas", "BeautifulSoup", "Pygame",
        "B", "Pandas offers rich DataFrames for data cleaning, aggregation, reshaping, and tabular manipulation."
    ],
    [
        75, "Python & AI/ML", "Hard",
        "What is 'Overfitting' in machine learning and how is it mitigated?",
        "When a model performs poorly on training data; mitigated by adding more layers",
        "When a model memorizes training noise and fails to generalize to test data; mitigated using regularization, cross-validation, and dropout",
        "When a model trains too slowly on GPUs",
        "When data has missing null values",
        "B", "Overfitting occurs when a complex model fits training data too closely; techniques like L1/L2 regularization and early stopping prevent it."
    ],
    [
        76, "Python & AI/ML", "Medium",
        "What is the output of 'bool([])' in Python?",
        "True", "False", "None", "Error",
        "B", "Empty collections (empty list [], dict {}, set (), tuple ()) evaluate to False in boolean contexts."
    ],
    [
        77, "Python & AI/ML", "Medium",
        "What is the purpose of a Confusion Matrix in classification evaluation?",
        "To measure GPU RAM usage during inference",
        "A table showing True Positives, True Negatives, False Positives, and False Negatives",
        "To randomize training dataset batches",
        "To plot neural network architecture diagrams",
        "B", "A confusion matrix cross-tabulates actual vs predicted classes, enabling computation of Precision, Recall, and F1-Score."
    ],
    [
        78, "Python & AI/ML", "Easy",
        "In Python, which keyword is used to create a generator function that produces a sequence of values lazily?",
        "return", "yield", "emit", "produce",
        "B", "'yield' turns a function into a generator that produces items on-demand, saving memory for large datasets."
    ],
    [
        79, "Python & AI/ML", "Hard",
        "What is the 'Attention Mechanism' in Transformer-based Large Language Models (LLMs)?",
        "A technique allowing models to dynamically weigh the relevance of different words in a sequence regardless of distance",
        "A method to alert developers when training crashes",
        "A way to increase batch size linearly",
        "An image compression filter",
        "A", "Self-attention computes dynamic weights between all tokens in a prompt, enabling deep contextual understanding across long sequences."
    ],
    [
        80, "Python & AI/ML", "Medium",
        "Which metric measures the balance between Precision and Recall in classification?",
        "Mean Squared Error (MSE)", "R-squared", "F1 Score", "Cosine Similarity",
        "C", "The F1 Score is the harmonic mean of precision and recall (2 * (P * R) / (P + R))."
    ],

    // 7. Digital Marketing, SEO & Social Media (81-90)
    [
        81, "Digital Marketing & SEO", "Easy",
        "What does SEO stand for in digital marketing?",
        "Social Engine Optimization", "Search Engine Optimization", "System Enterprise Operation", "Site Efficiency Overview",
        "B", "SEO (Search Engine Optimization) is the practice of optimizing web content to rank higher in organic search engine results."
    ],
    [
        82, "Digital Marketing & SEO", "Medium",
        "What is a 'Canonical URL' tag (<link rel='canonical'>) used for?",
        "To tell search engines which URL represents the master copy of a page to prevent duplicate content penalties",
        "To speed up image loading from CDNs",
        "To redirect users to the login page",
        "To track Google Analytics conversions",
        "A", "Canonical tags specify the preferred URL when multiple URLs serve identical or duplicate content."
    ],
    [
        83, "Digital Marketing & SEO", "Easy",
        "What is CTR in digital marketing campaigns?",
        "Cost To Rank", "Click-Through Rate", "Customer Tracking Record", "Conversion Target Ratio",
        "B", "CTR (Click-Through Rate) is the ratio of users who click on a specific link/ad to the total number of users who viewed it (Clicks / Impressions * 100)."
    ],
    [
        84, "Digital Marketing & SEO", "Medium",
        "What is the recommended ideal length for an SEO Meta Description for Google Search?",
        "20 - 40 characters", "120 - 160 characters", "300 - 500 characters", "Over 1000 characters",
        "B", "Google typically truncates snippets at around 155-160 characters on desktop and slightly less on mobile devices."
    ],
    [
        85, "Digital Marketing & SEO", "Medium",
        "What are Open Graph (og:) meta tags primarily used for?",
        "Enabling dark mode on web browsers",
        "Controlling how URLs are displayed with rich titles, images, and descriptions when shared on social media (Facebook, LinkedIn, Twitter)",
        "Managing SQL database permissions",
        "Running Google Ads campaigns",
        "B", "Open Graph protocol tags (og:title, og:image, og:description) define rich preview cards across social networks."
    ],
    [
        86, "Digital Marketing & SEO", "Hard",
        "What is JSON-LD Schema Structured Data used for on web pages?",
        "Storing user shopping carts in localStorage",
        "Providing machine-readable context to search engines (Google) to enable rich snippets (breadcrumbs, ratings, organization details)",
        "Executing JavaScript server-side functions",
        "Compressing CSS files",
        "B", "JSON-LD schema markup (schema.org) structures organizational, product, course, or article data for enhanced search engine rich results."
    ],
    [
        87, "Digital Marketing & SEO", "Easy",
        "In Google Ads / PPC advertising, what does CPC mean?",
        "Cost Per Click", "Cost Per Customer", "Campaign Performance Center", "Clicks Per Conversion",
        "A", "Cost Per Click (CPC) is the actual amount an advertiser pays each time a user clicks on their paid advertisement."
    ],
    [
        88, "Digital Marketing & SEO", "Medium",
        "What is the difference between 'Dofollow' and 'Nofollow' backlinks in SEO?",
        "Dofollow passes PageRank/link equity to the target site; Nofollow instructs bots not to pass ranking signals",
        "Nofollow links are illegal in search marketing",
        "Dofollow links are only used for internal navigation",
        "Nofollow links load faster than dofollow links",
        "A", "Standard links pass link equity (Dofollow); rel='nofollow' tells search crawlers not to endorse or pass SEO authority to the destination."
    ],
    [
        89, "Digital Marketing & SEO", "Medium",
        "What does the robots.txt file do on a website?",
        "Controls user login authentication",
        "Instructs search engine web crawlers which URLs or directories they can or cannot crawl",
        "Contains the SSL security certificate",
        "Stores Google Tag Manager scripts",
        "B", "robots.txt provides rules (Allow/Disallow directives) for web spiders and search crawlers visiting the site."
    ],
    [
        90, "Digital Marketing & SEO", "Hard",
        "What are Google Core Web Vitals focused on measuring?",
        "The number of backlink domains pointing to a website",
        "Real-world user experience metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS)",
        "The total count of blog posts published per month",
        "Server CPU and RAM usage during peak traffic",
        "B", "Core Web Vitals are key page experience signals evaluating loading speed (LCP), responsiveness (INP), and visual stability (CLS)."
    ],

    // 8. Git, REST APIs, Security & DevOps (91-100)
    [
        91, "Git & DevOps", "Easy",
        "Which Git command creates a new branch and switches to it in one step?",
        "git branch new-feature", "git checkout -b new-feature / git switch -c new-feature", "git merge new-feature", "git push -b new-feature",
        "B", "'git checkout -b <name>' or 'git switch -c <name>' creates and checks out the new branch simultaneously."
    ],
    [
        92, "REST APIs & Security", "Medium",
        "Which HTTP method is idempotent and used to replace an existing resource completely?",
        "POST", "PUT", "PATCH", "CONNECT",
        "B", "PUT replaces the complete target resource representation and is idempotent (calling it multiple times produces the same result)."
    ],
    [
        93, "REST APIs & Security", "Medium",
        "What does CORS stand for in web application security?",
        "Cross-Origin Resource Sharing", "Centralized Object Routing System", "Client Origin Request Security", "Certified Open Resource Standard",
        "A", "CORS is an HTTP-header based security mechanism that allows a server to indicate which origins are permitted to access its resources."
    ],
    [
        94, "REST APIs & Security", "Hard",
        "What is a Cross-Site Scripting (XSS) attack and how is it prevented?",
        "Overloading a server with traffic; prevented by Cloudflare DDoS protection",
        "Injecting malicious client-side scripts into web pages viewed by other users; prevented by sanitizing inputs and escaping output HTML",
        "Extracting passwords from databases via SQL syntax errors",
        "Intercepting unencrypted Wi-Fi packets",
        "B", "XSS occurs when untrusted data executes in a user's browser; robust output encoding, input validation, and CSP headers prevent it."
    ],
    [
        95, "Git & DevOps", "Easy",
        "What does the 'git pull' command do?",
        "Pushes local commits to the remote repository",
        "Fetches and integrates changes from the remote repository into the current local branch",
        "Deletes uncommitted local changes",
        "Creates a new pull request on GitHub",
        "B", "'git pull' executes 'git fetch' followed by 'git merge' to bring local branches up to date with remote repositories."
    ],
    [
        96, "REST APIs & Security", "Medium",
        "What is the structure of a JSON Web Token (JWT)?",
        "Username.Password.Timestamp",
        "Header.Payload.Signature",
        "Key.IV.Ciphertext",
        "Host.Port.Path",
        "B", "JWTs consist of three Base64URL-encoded parts separated by dots: Header (algorithm), Payload (claims/data), and Signature (verification hash)."
    ],
    [
        97, "Git & DevOps", "Medium",
        "What is Docker used for in modern software development and deployment?",
        "To write unit tests in JavaScript",
        "Containerizing applications with all their dependencies to run consistently across any computing environment",
        "Managing DNS records for domain names",
        "Compressing video and image files",
        "B", "Docker packages code, runtime, system tools, and libraries into portable containers that run identically in development, staging, and production."
    ],
    [
        98, "REST APIs & Security", "Hard",
        "What is SQL Injection (SQLi) and how do modern frameworks prevent it?",
        "Inserting SQL queries via user inputs to manipulate database execution; prevented using Prepared Statements / Parameterized Queries",
        "Running migrations concurrently; prevented by locking tables",
        "Corrupting database indexes; prevented by running REINDEX",
        "A brute-force password guessing attack",
        "A", "Prepared statements and ORMs (like Eloquent) separate SQL code from user data parameters, neutralizing injection attempts."
    ],
    [
        99, "Git & DevOps", "Medium",
        "What is the purpose of CI/CD (Continuous Integration / Continuous Deployment) pipelines?",
        "To automatically build, test, and deploy code changes to production environments whenever commits are pushed",
        "To design frontend UI mockups automatically",
        "To register domain names on Google Domains",
        "To manage employee payroll",
        "A", "CI/CD automates software validation (linting, tests) and deployment workflows, ensuring fast and reliable releases."
    ],
    [
        100, "REST APIs & Security", "Easy",
        "Which HTTP status code signifies that a resource was successfully created on the server?",
        "200 OK", "201 Created", "204 No Content", "301 Moved Permanently",
        "B", "HTTP 201 Created indicates that the request has succeeded and led to the creation of one or more new resources."
    ]
];

// 1. Output CSV File
$csvPath = __DIR__ . '/../public/100_MCQ_Question_Bank.csv';
$csvBackendPath = 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/public/100_MCQ_Question_Bank.csv';

$fp = fopen($csvPath, 'w');
// Add UTF-8 BOM for Microsoft Excel compatibility
fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));

// Headers
fputcsv($fp, [
    'Question ID',
    'Category',
    'Difficulty',
    'Question Text',
    'Option A',
    'Option B',
    'Option C',
    'Option D',
    'Correct Answer',
    'Explanation'
]);

foreach ($mcqs as $row) {
    fputcsv($fp, $row);
}
fclose($fp);

// Copy to backend public directory if available
if (is_dir('c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/public')) {
    copy($csvPath, $csvBackendPath);
}

// 2. Output XML-Based Excel (.xls / .xlsx compatible spreadsheet)
$xlsPath = __DIR__ . '/../public/100_MCQ_Question_Bank.xls';
$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<?mso-application progid="Excel.Sheet"?>' . "\n";
$xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"' . "\n";
$xml .= ' xmlns:o="urn:schemas-microsoft-com:office:office"' . "\n";
$xml .= ' xmlns:x="urn:schemas-microsoft-com:office:excel"' . "\n";
$xml .= ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"' . "\n";
$xml .= ' xmlns:html="http://www.w3.org/TR/REC-html40">' . "\n";
$xml .= ' <Styles>' . "\n";
$xml .= '  <Style ss:ID="Header">' . "\n";
$xml .= '   <Font ss:Bold="1" ss:Color="#FFFFFF"/>' . "\n";
$xml .= '   <Interior ss:Color="#1B2A6B" ss:Pattern="Solid"/>' . "\n";
$xml .= '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>' . "\n";
$xml .= '  </Style>' . "\n";
$xml .= '  <Style ss:ID="Bold">' . "\n";
$xml .= '   <Font ss:Bold="1"/>' . "\n";
$xml .= '   <Alignment ss:Horizontal="Center"/>' . "\n";
$xml .= '  </Style>' . "\n";
$xml .= '  <Style ss:ID="Default">' . "\n";
$xml .= '   <Alignment ss:Vertical="Center" ss:WrapText="1"/>' . "\n";
$xml .= '  </Style>' . "\n";
$xml .= ' </Styles>' . "\n";
$xml .= ' <Worksheet ss:Name="100_MCQ_Question_Bank">' . "\n";
$xml .= '  <Table>' . "\n";
$xml .= '   <Column ss:Width="70"/>' . "\n";
$xml .= '   <Column ss:Width="140"/>' . "\n";
$xml .= '   <Column ss:Width="80"/>' . "\n";
$xml .= '   <Column ss:Width="350"/>' . "\n";
$xml .= '   <Column ss:Width="200"/>' . "\n";
$xml .= '   <Column ss:Width="200"/>' . "\n";
$xml .= '   <Column ss:Width="200"/>' . "\n";
$xml .= '   <Column ss:Width="200"/>' . "\n";
$xml .= '   <Column ss:Width="90"/>' . "\n";
$xml .= '   <Column ss:Width="300"/>' . "\n";

// Header row
$xml .= '   <Row ss:Height="26">' . "\n";
$headers = ['Question ID', 'Category', 'Difficulty', 'Question Text', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation'];
foreach ($headers as $h) {
    $xml .= '    <Cell ss:StyleID="Header"><Data ss:Type="String">' . htmlspecialchars($h, ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
}
$xml .= '   </Row>' . "\n";

// Data rows
foreach ($mcqs as $m) {
    $xml .= '   <Row ss:Height="22">' . "\n";
    $xml .= '    <Cell ss:StyleID="Bold"><Data ss:Type="Number">' . $m[0] . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[1], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Bold"><Data ss:Type="String">' . htmlspecialchars($m[2], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[3], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[4], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[5], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[6], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[7], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Bold"><Data ss:Type="String">' . htmlspecialchars($m[8], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '    <Cell ss:StyleID="Default"><Data ss:Type="String">' . htmlspecialchars($m[9], ENT_QUOTES, 'UTF-8') . '</Data></Cell>' . "\n";
    $xml .= '   </Row>' . "\n";
}

$xml .= '  </Table>' . "\n";
$xml .= ' </Worksheet>' . "\n";
$xml .= '</Workbook>' . "\n";

file_put_contents($xlsPath, $xml);
if (is_dir('c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/public')) {
    file_put_contents('c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/public/100_MCQ_Question_Bank.xls', $xml);
}

echo "Successfully generated 100 MCQs in CSV and Excel formats!\n";
echo "Files:\n";
echo "1. {$csvPath}\n";
echo "2. {$xlsPath}\n";
