-- Task: Insert new account record for Tony Stark
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