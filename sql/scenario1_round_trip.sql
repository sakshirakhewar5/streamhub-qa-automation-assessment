-- MySQL 8+ / PostgreSQL-compatible approach.
-- Find A -> B followed by B -> A within 24 hours,
-- where the return amount is within +/-10% of the original.

SELECT
    t1.transaction_id AS outbound_transaction,
    t2.transaction_id AS return_transaction,
    t1.from_account AS account_a,
    t1.to_account AS account_b,
    t1.amount AS outbound_amount,
    t2.amount AS return_amount,
    t1.transaction_time AS outbound_time,
    t2.transaction_time AS return_time
FROM transactions t1
JOIN transactions t2
  ON t2.from_account = t1.to_account
 AND t2.to_account = t1.from_account
 AND t2.transaction_time > t1.transaction_time
 AND t2.transaction_time <= t1.transaction_time + INTERVAL 24 HOUR
 AND t2.amount BETWEEN t1.amount * 0.90 AND t1.amount * 1.10
ORDER BY t1.transaction_time;
