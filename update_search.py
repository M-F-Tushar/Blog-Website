import re

with open('src/components/Search.tsx', 'r') as f:
    content = f.read()

# Update input
content = content.replace(
    'className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg shadow-secondary-200/50 dark:shadow-none transition-all text-lg"',
    'className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg shadow-secondary-200/50 dark:shadow-none transition-all text-lg"\n              aria-label="Search query"'
)

# Update filters button
content = content.replace(
    '<button\n                  onClick={() => setShowFilters(!showFilters)}',
    '<button\n                  onClick={() => setShowFilters(!showFilters)}\n                  aria-expanded={showFilters}\n                  aria-controls="filters-panel"'
)

# Update filters panel
content = content.replace(
    'className="mb-8 overflow-hidden"\n              >',
    'id="filters-panel"\n                className="mb-8 overflow-hidden"\n              >'
)

# Update select
content = content.replace(
    'className="bg-transparent border-none text-sm font-medium text-secondary-700 dark:text-secondary-300 focus:ring-0 cursor-pointer py-1 pr-8"\n                  >',
    'className="bg-transparent border-none text-sm font-medium text-secondary-700 dark:text-secondary-300 focus:ring-0 cursor-pointer py-1 pr-8"\n                    aria-label="Sort results by"\n                  >'
)

with open('src/components/Search.tsx', 'w') as f:
    f.write(content)
