import Groq from 'groq-sdk'

const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY })

export const getTopVacanciesForCandidate = async (candidate, vacancies) => {
  const prompt = `
Eres un sistema experto en matching de talento humano.

PERFIL DEL CANDIDATO:
- Nombre: ${candidate.first_name} ${candidate.last_name}
- Habilidades: ${Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills}
- Años de experiencia: ${candidate.experience_years}
- Ciudad: ${candidate.city}, ${candidate.country}

VACANTES DISPONIBLES:
${vacancies.map((v, i) => `
${i + 1}. ID: ${v.id}
   Título: ${v.title}
   Empresa: ${v.company_name || 'Sin nombre'}
   Ubicación: ${v.location}
   Modalidad: ${v.modality}
   Jornada: ${v.work_schedule}
   Descripción: ${v.description?.slice(0, 200)}
`).join('\n')}

Selecciona las 5 vacantes más compatibles con el perfil del candidato.
Responde ÚNICAMENTE con un JSON válido con esta estructura, sin texto adicional:
{
  "recommendations": [
    {
      "vacancy_id": 1,
      "score": 95,
      "reason": "Explicación breve de por qué es una buena coincidencia"
    }
  ]
}
`

  const response = await getGroqClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1000
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export const getTopCandidatesForVacancy = async (vacancy, candidates) => {
  const prompt = `
Eres un sistema experto en matching de talento humano.

VACANTE:
- Título: ${vacancy.title}
- Descripción: ${vacancy.description}
- Ubicación: ${vacancy.location}
- Modalidad: ${vacancy.modality}
- Jornada: ${vacancy.work_schedule}

CANDIDATOS POSTULADOS:
${candidates.map((c, i) => `
${i + 1}. ID postulación: ${c.apply_id}
   Nombre: ${c.first_name} ${c.last_name}
   Habilidades: ${Array.isArray(c.skills) ? c.skills.join(', ') : c.skills}
   Experiencia: ${c.experience_years} años
   Ciudad: ${c.city}, ${c.country}
`).join('\n')}

Selecciona los 5 candidatos más compatibles con la vacante.
Responde ÚNICAMENTE con un JSON válido con esta estructura, sin texto adicional:
{
  "recommendations": [
    {
      "apply_id": 1,
      "score": 95,
      "reason": "Explicación breve de por qué es una buena coincidencia"
    }
  ]
}
`

  const response = await getGroqClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1000
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
