import { openrouter, MODEL } from "@/app/lib/openrouter";

export async function POST(req) {

  try {

    const {
      userMessage,
      candidateName,
      jobTitle,
      askedQuestions = [],
      history = [],
      questionCount = 0
    } = await req.json();

    const MAX_QUESTIONS = 4;

    if (questionCount >= MAX_QUESTIONS) {
      return Response.json({ message: "INTERVIEW_COMPLETE" });
    }

    const systemPrompt = `
You are a senior technical interviewer.

Candidate: ${candidateName}
Role: ${jobTitle}

Your job is to evaluate technical depth.

STRICT RULES

- Ask ONE question at a time
- Questions must relate to "${jobTitle}"
- Never repeat a question
- Never explain answers
- Never praise the candidate
- Never say mock interview

INTERVIEW BEHAVIOR

If answer is weak:
move to a different topic.

If answer is average:
ask a follow-up.

If answer is strong:
ask a harder question.

Previously asked questions:
${askedQuestions.join("\n")}

Never repeat these.

Ask exactly ${MAX_QUESTIONS} questions.

After final question return ONLY:

INTERVIEW_COMPLETE
`;

    const messages = [

      {
        role: "system",
        content: systemPrompt
      }

    ];

    history.forEach(m => {

      messages.push({
        role: m.sender === "ai" ? "assistant" : "user",
        content: m.text
      });

    });

    if (userMessage) {

      messages.push({
        role: "user",
        content: userMessage
      });

    }

    const completion = await openrouter.chat.completions.create({

      model: MODEL,

      messages,

      temperature: 0,

      max_tokens: 200

    });

    let aiReply = completion.choices[0].message.content;

    aiReply = aiReply
      .replace(/mock interview/gi, "")
      .replace(/simulation interview/gi, "");

    return Response.json({ message: aiReply });

  }

  catch (error) {

    console.error(error);

    return Response.json(
      { error: "AI failed" },
      { status: 500 }
    );

  }

}