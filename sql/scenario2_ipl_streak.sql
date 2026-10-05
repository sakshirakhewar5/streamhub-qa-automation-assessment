-- Identify players with 30+ runs in at least 3 consecutive matches.
-- Consecutive means the next row for the same player has match_no exactly +1.

WITH qualifying AS (
    SELECT
        player_name,
        match_date,
        match_no,
        runs,
        match_no - ROW_NUMBER() OVER (
            PARTITION BY player_name
            ORDER BY match_no
        ) AS grp
    FROM ipl_2024_scores
    WHERE runs >= 30
),
streaks AS (
    SELECT
        player_name,
        MIN(match_date) AS streak_started,
        COUNT(*) AS streak_length
    FROM qualifying
    GROUP BY player_name, grp
)
SELECT
    player_name,
    streak_started
FROM streaks
WHERE streak_length >= 3
ORDER BY streak_started, player_name;
