@@ -24,35 +24,62 @@ router.get('/questions', async (req, res) => {
        field, 
        input_type, 
        "order"
      FROM questions
      ORDER BY "order" ASC
    `;

    const { rows } = await pool.query(query);
    console.log(`✅ Retrieved ${rows.length} question(s) from database`);

    if (!rows || rows.length === 0) {
      console.warn('⚠️  No questions found in database');
      return res.status(404).json({ message: 'No quiz questions found.' });
    }

    const questions = rows.map((q) => ({
      id: q.id,
      category: q.category,
      question_text: q.question_text,
      field: q.field,
      choices: Array.isArray(q.choices) ? q.choices : [], // defensive fallback
      input_type: q.input_type || 'radio',
      order: q.order,
    }));

    res.json({ questions });
    // Insert the decade question as the first question if not already present
    const decadeQuestion = {
      id: null,
      category: 'Time Period',
      question_text: 'What decade is your movie from?',
      field: 'release_date',
      input_type: 'radio',
      choices: [
        { value: '1920', label: '1920s - Women\u2019s Suffrage (19th Amendment, 1920); The Jazz Singer (1927)' },
        { value: '1930', label: '1930s - The New Deal & FDR\u2019s Fireside Chats (1933); The Wizard of Oz (1939)' },
        { value: '1940', label: "1940s - Victory in World War II (1945); It's a Wonderful Life (1946)" },
        { value: '1950', label: '1950s - The Polio Vaccine (1955); Singin\u2019 in the Rain (1952)' },
        { value: '1960', label: '1960s - Apollo 11 Moon Landing (1969); The Sound of Music (1965)' },
        { value: '1970', label: '1970s - The U.S. Bicentennial (1976); Star Wars (1977)' },
        { value: '1980', label: '1980s - The Fall of the Berlin Wall (1989); E.T. the Extra-Terrestrial (1982)' },
        { value: '1990', label: '1990s - The Rise of the Internet (World Wide Web, 1990s); Titanic (1997)' },
        { value: '2000', label: '2000s - September 11 Attacks (2001); The Dark Knight (2008)' },
        { value: '2010', label: '2010s - Osama bin Laden\u2019s Death (2011); Frozen (2013)' },
        { value: '2020', label: '2020s - The COVID-19 Pandemic (2020); Top Gun: Maverick (2022)' },
        { value: 'any', label: 'Any' },
      ],
      order: 1,
    };

    const filteredQuestions = questions.filter((q) => q.field !== 'release_date');
    filteredQuestions.unshift(decadeQuestion);

    res.json({ questions: filteredQuestions });
  } catch (error) {
    console.error('❌ Error in /api/questions:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
