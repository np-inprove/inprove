<script setup lang="ts">
interface Author {
  name: string
  title: string
  picture: string
}

const { isDark } = useTheme()

const textColor = computed(() => {
  if (isDark.value)
    return 'text-black'

  else
    return 'text-white'
})

const bgColor = computed(() => {
  if (isDark.value)
    return 'bg-white'

  else
    return 'bg-black'
})

const authors = [
  {
    name: 'Ngui Jia Le Sherlena',
    title: 'Student at Ngee Ann Polytechnic',
    picture: '/images/authors/sherlena.webp',
  },
  {
    name: 'Qin Guan',
    title: 'Student at Ngee Ann Polytechnic',
    picture: '/images/authors/qin-guan.webp',
  },
  {
    name: 'Tan Yun-E',
    title: 'Student at Ngee Ann Polytechnic',
    picture: '/images/authors/yun-e.webp',
  },
] satisfies Author[]
</script>

<template>
  <NavBar />
  <main class="mx-auto px-6 container">
    <div pb-5 md:pb-10>
      <h2 py-5 text-center text-3xl font-bold>
        Purpose of iNProve
      </h2>
      <div text-justify>
        <p>
          iNProve is a platform build by students for students. The aims of the platform is to make classes more engaging
          and effective for students. While students are rewarded with incentives, lecturers are able to better gauge the
          understanding of students by being able to track their students progress.
        </p>
        <p pt-5>
          With the rise of asynchronous learning, students face new challenges in their learning experience. Compared to
          traditional lessons, asynchronous learning may seem uninteresting to students, causing trouble with focus,
          frustration, or even boredom. For educators, this is no doubt a frustrating issue. Scenarios where educators are
          uncertain whether students have completed their lesson content are becoming more common. As a result, it is
          increasingly important for educators to find ways to make asynchronous learning more fun and engaging for
          students.
        </p>
        <p pt-5>
          Gamification is a potential solution to boost the effectiveness of self directed learning. iNProve aims to be a
          holistic, gamified platform, purpose built to help improve students’ engagement, motivation as well as knowledge
          retention. With proper incentives, students will be more likely to find solutions to problems that they may face,
          and assist other students.
        </p>
        <p pt-5>
          Gamification can also serve as a tool for lecturers to improve their rapport with students. With a better rapport
          and more motivated students, educators will be able to better gauge students’ progress throughout the term.
        </p>
        <p pt-5>
          iNProve is a platform that is designed to help students learn more effectively, using a variety of gamified
          elements. iNProve also provides opportunities for students to collaborate with each other and to receive feedback
          from their instructors.
          Gamification has the potential to revolutionize the way that students learn. By making learning more fun and
          engaging, gamification can help to improve student outcomes and to create a more positive learning environment for
          all.
        </p>
      </div>
      <h2 py-5 text-center text-3xl font-bold>
        Design Rationale
      </h2>
      <div grid="~ cols-1 md:cols-2" p-5>
        <div h-full flex items-center justify-center py-2>
          <CommonAppLogo h-30 />
        </div>
        <div text-justify md:pl-10>
          <p>
            The rocket in the i represents the user embarking on the journey of self-directed learning. The colour
            <span class="bg-logo-red" px-1 :class="textColor">RED</span> is used to emphasise the part that the user has to
            play.
          </p>
          <p pt-5>
            The NP represents the school which this learning platform was created under. While the use of the colour
            <span px-1 :class="[textColor, bgColor]">{{ isDark === true ? 'WHITE' : 'BLACK' }}</span> represents
            that there is still some formality.
          </p>
          <p pt-5>
            The letters r and v are playing with the letter o which is designed as a ball to emphasise the gamification of
            the platform and the colours used are brighter colours like <span class="bg-logo-yellow" px-1 text-black>YELLOW</span> and
            <span class="bg-logo-cyan" px-1 text-black>CYAN</span> to show a more fun platform.
          </p>
        </div>
      </div>
      <h2 py-5 text-center text-3xl font-bold>
        Developers of iNProve
      </h2>
      <div grid="~ cols-1 md:cols-3 gap-5">
        <LandingAboutUsCard v-for="author in authors" v-bind="author" :key="author.name" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-logo-red {
  background-color: hsl(5, 100%, 68%);
}
.bg-logo-yellow {
  background-color: hsl(48, 100%, 50%);
}
.bg-logo-cyan {
  background-color: hsl(173, 100%, 43%);
}
</style>
