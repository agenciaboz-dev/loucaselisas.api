// CURSO

const onCourseLike = (user_name: string, course_name: string) => ({
    title: "Curso curtido",
    body: `${user_name} curtiu o seu curso ${course_name}`,
})

const onCourseDisable = (course_name: string) => ({
    title: "Curso desativado",
    body: `O curso ${course_name} está análise novamente, toque aqui para acessá-lo`,
})

const onCourseCreate = () => ({
    title: "Curso cadastrado",
    body: "Seu curso foi enviado para análise, aguarde retorno",
})

const onCourseCreateAdm = (course_name: string) => ({
    title: "Curso cadastrado",
    body: `Curso ${course_name} foi cadastrado. Aguardando análise`,
})

const onCourseApprove = (course_name: string) => ({
    title: "Curso aprovado",
    body: `Parabéns, o curso ${course_name} foi aprovado e já está disponível na plataforma`,
})

const onCourseDecline = (course_name: string) => ({
    title: "Curso reprovado",
    body: `Infelizmente o curso ${course_name} foi reprovado. Toque para mais informações`,
})

// LIÇÂO

const onLessonLike = (user_name: string, course_name: string, lesson_name: string) => ({
    title: "Lição curtida",
    body: `${user_name} curtiu a lição ${lesson_name} do curso ${course_name}`,
})

const onLessonCreate = (course_name: string, lesson_name: string) => ({
    title: "Lição Cadastrada",
    body: `Lição ${lesson_name}, do curso ${course_name}, enviada para análise. Aguarde retorno`,
})

const onLessonCreateAdm = (course_name: string, lesson_name: string) => ({
    title: "Lição Cadastrada",
    body: `Lição ${lesson_name}, do curso ${course_name} foi cadastrada. Aguardando análise.`,
})

const onLessonApprove = (course_name: string, lesson_name: string) => ({
    title: "Lição aprovada",
    body: `Parabéns! A lição ${lesson_name}, do curso ${course_name}, foi aprovada e já está disponível na plataforma`,
})

const onLessonApproveToFollowers = (course_name: string) => ({
    title: "Nova lição",
    body: `Uma nova lição foi publicada no curso ${course_name}. Toque aqui para acessar`,
})

const onLessonDecline = (course_name: string, lesson_name: string) => ({
    title: "Lição reprovada",
    body: `Infelizmente, a lição ${lesson_name}, do curso ${course_name} foi reprovada. Toque aqui para mais informações`,
})

// MENSAGEM

const onAdmMessage = (course_name: string) => ({
    title: "Nova mensagem do administrador",
    body: `Um administrador enviou uma mensagem no chat do curso ${course_name}. Toque aqui para acessar`,
})

const onMessageToCreator = (username: string, course_name: string, text: string) => ({
    title: "Novo comentário",
    body: `${username} enviou mensagem no curso ${course_name}: ${text || "sem texto"}`,
})

export default {
    onCourseLike,
    onCourseDisable,
    onCourseCreate,
    onCourseCreateAdm,
    onCourseApprove,
    onCourseDecline,
    onLessonLike,
    onLessonCreate,
    onLessonCreateAdm,
    onLessonApprove,
    onLessonApproveToFollowers,
    onLessonDecline,
    onAdmMessage,
    onMessageToCreator,
}
