-- Task 1: Insert new account record for Tony Stark
-- Note: account_id and account_type will handle their own values (auto-generated and default)

INSERT INTO
    public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );

-- Task 2 : Update Tony Stark's account to change account_type to "Admin", use email as unique identiier
UPDATE public.account
SET
    account_type = 'Admin'
WHERE
    account_email = 'tony@starkent.com';

-- Task 3: Delete Tony Stark record from the database
DELETE FROM public.account
WHERE
    account_email = 'tony@starkent.com';

-- Task 4: Update GM Hummer record to change "small interiors" to "a huge interior" used replace to target needed update without repeating the entire description
UPDATE public.inventory
SET
    inv_description =
REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE
    inv_make = 'GM'
    AND inv_model = 'Hummer';

-- Task 5: Use INNER JOIN to select make, model, and classification name for "Sport" category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';

-- Task 6: Update all inventory records to add "/vehicles" to the middle of file paths
UPDATE public.inventory
SET
    inv_image =
REPLACE (
        inv_image,
        '/images/',
        '/images/vehicles/'
    ),
    inv_thumbnail =
REPLACE (
        inv_thumbnail,
        '/images/',
        '/images/vehicles/'
    );