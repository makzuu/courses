#include <ctype.h>
#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Points assigned to each letter of the alphabet
int POINTS[] = {1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10};

int compute_score(string word);

int main(void)
{
    // Get input words from both players
    string word1 = get_string("Player 1: ");
    string word2 = get_string("Player 2: ");

    // Score both words
    int score1 = compute_score(word1);
    int score2 = compute_score(word2);

    string result = score1 > score2 ? "Player 1 wins!" : score1 < score2 ? "Player 2 wins!" : "Tie!";
    printf("%s\n", result);
}

int compute_score(string word)
{
    int score = 0;
    for (int i = 0, len = strlen(word); i < len; i++)
    {
        char letter = toupper(word[i]);
        int value = isalpha(letter) ? POINTS[letter - 65] : 0;
        score += value;
    }
    return score;
}
