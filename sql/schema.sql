CREATE TABLE accounts (
    account_id VARCHAR(20) PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL
);

CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY,
    from_account VARCHAR(20) NOT NULL,
    to_account VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_time TIMESTAMP NOT NULL,
    FOREIGN KEY (from_account) REFERENCES accounts(account_id),
    FOREIGN KEY (to_account) REFERENCES accounts(account_id)
);

CREATE TABLE ipl_2024_scores (
    player_name VARCHAR(100) NOT NULL,
    match_date DATE NOT NULL,
    match_no INT NOT NULL,
    runs INT NOT NULL
);
