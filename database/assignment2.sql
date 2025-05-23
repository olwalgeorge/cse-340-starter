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