-- Sample SQL queries for StyleMate database

-- 1. Get total count of items
SELECT COUNT(*) as total_items FROM style_items;

-- 2. Get items by category
SELECT master_category, COUNT(*) as count 
FROM style_items 
GROUP BY master_category 
ORDER BY count DESC;

-- 3. Get men's casual wear
SELECT product_display_name, base_colour, article_type, link
FROM style_items 
WHERE gender = 'Men' AND usage = 'Casual'
LIMIT 10;

-- 4. Get items by color
SELECT base_colour, COUNT(*) as count 
FROM style_items 
GROUP BY base_colour 
ORDER BY count DESC 
LIMIT 15;

-- 5. Get summer clothing
SELECT product_display_name, master_category, base_colour, link
FROM style_items 
WHERE season = 'Summer'
LIMIT 10;

-- 6. Search for specific article type
SELECT product_display_name, base_colour, usage, link
FROM style_items 
WHERE article_type ILIKE '%shirt%'
LIMIT 10;

-- 7. Get items by year
SELECT year, COUNT(*) as count 
FROM style_items 
WHERE year > 0
GROUP BY year 
ORDER BY year DESC;

-- 8. Complex query: Men's black casual tops
SELECT product_display_name, article_type, season, link
FROM style_items 
WHERE gender = 'Men' 
  AND base_colour = 'Black' 
  AND usage = 'Casual'
  AND master_category = 'Apparel'
  AND article_type ILIKE '%top%' OR article_type ILIKE '%shirt%'
LIMIT 10;

-- 9. Get statistics by gender and category
SELECT gender, master_category, COUNT(*) as count
FROM style_items 
GROUP BY gender, master_category 
ORDER BY gender, count DESC;

-- 10. Find items with missing data
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN product_display_name = '' THEN 1 END) as missing_name,
  COUNT(CASE WHEN link = '' THEN 1 END) as missing_link,
  COUNT(CASE WHEN base_colour = '' THEN 1 END) as missing_color
FROM style_items;
