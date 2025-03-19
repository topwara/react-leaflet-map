import cors from 'cors'
import express from 'express'
import { create } from 'xmlbuilder2'

const app = express()
const PORT = 3001 // หรือพอร์ตที่ต้องการ

// กำหนดค่า CORS เพื่ออนุญาตให้เข้าถึงจาก origin ที่เชื่อถือได้เท่านั้น
const allowedOrigins = ['http://localhost:3000']

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: any, allow?: boolean) => void) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // กำหนดวิธีการที่อนุญาต
  allowedHeaders: ['Content-Type', 'Authorization'], // กำหนด header ที่อนุญาต
}

// ใช้ CORS middleware
app.use(cors(corsOptions))

app.get('/rss', (req, res) => {
  interface NewsItem {
    title: string
    link: string
    description: string
    pubDate: string
    guid: string
    imageUrl: string
  }

  const buildRSSFeed = () => {
    // สมมุติว่าเราได้รับข้อมูลข่าวมาเป็น array
    const newsData: NewsItem[] = [
      {
        title: 'The Naked Gun: From the Files of Police Squad! (1988)',
        link: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiMue__--yLAxXSTWwGHQsdDFQQFnoECCAQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0095705%2F&usg=AOvVaw2iybeAC_1n8BUYlBhRLiUX&opi=89978449',
        description:
          'Incompetent police Detective Frank Drebin must foil an attempt to assassinate Queen Elizabeth II.',
        pubDate: new Date().toUTCString(),
        guid: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiMue__--yLAxXSTWwGHQsdDFQQFnoECCAQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0095705%2F&usg=AOvVaw2iybeAC_1n8BUYlBhRLiUX&opi=89978449',
        imageUrl: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11300_p_v8_ak.jpg', // ลิงค์ของรูปภาพ
      },
      {
        title: 'The Naked Gun 2½: The Smell of Fear (1991)',
        link: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjsxvTv--yLAxUMbmwGHfZvOfAQFnoECEUQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0102510%2F&usg=AOvVaw2wRNWreIvP-FEhCHh3jCpt&cshid=1740972541086224&opi=89978449',
        description:
          'Lieutenant Frank Drebin discovers that his ex-girlfriend new beau is involved in a plot to kidnap a scientist who advocates solar energy.',
        pubDate: new Date().toUTCString(),
        guid: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjsxvTv--yLAxUMbmwGHfZvOfAQFnoECEUQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0102510%2F&usg=AOvVaw2wRNWreIvP-FEhCHh3jCpt&cshid=1740972541086224&opi=89978449',
        imageUrl:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRA81QbFXJm83hkWw3ab5rxfdmQj2IiO33xfHvJyOmWLCJlT8oLh_TU61LTRNMXVdsWNxrsZQ', // ลิงค์ของรูปภาพ
      },
      {
        title: 'Naked Gun 33 1/3: The Final Insult (1994)',
        link: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiIhs_1--yLAxVdcGwGHd1tOnUQFnoECEYQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0110622%2F&usg=AOvVaw2zFwNg6KzMtLvkaL2ca-aN&cshid=1740972567156618&opi=89978449',
        description:
          'Frank Drebin comes out of retirement to help Police Squad infiltrate a gang of terrorists planning to detonate a bomb at the Academy Awards.',
        pubDate: new Date().toUTCString(),
        guid: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiIhs_1--yLAxVdcGwGHd1tOnUQFnoECEYQAQ&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0110622%2F&usg=AOvVaw2zFwNg6KzMtLvkaL2ca-aN&cshid=1740972567156618&opi=89978449',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm8G2raSvlC__k-SvV1UmC2KHue8rFVXGT1F-xpM6Jyeh5pyeUlFIKMx8iOYdz-a-W0dRA', // ลิงค์ของรูปภาพ
      },
    ]

    const feed = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('rss', { version: '2.0' })
      .ele('channel')
      .ele('title')
      .txt('Movies News')
      .up()
      .ele('link')
      .txt('https://www.google.com')
      .up()
      .ele('description')
      .txt('Latest news from Google')
      .up()
      .ele('language')
      .txt('th')
      .up()

    // Loop ผ่านข้อมูลข่าวเพื่อสร้าง <item> สำหรับแต่ละข่าว
    for (let i = 0; i < newsData.length; i++) {
      const newsItem = newsData[i]

      feed
        .ele('item')
        .ele('title')
        .txt(newsItem.title)
        .up()
        .ele('link')
        .txt(newsItem.link)
        .up()
        .ele('description')
        .txt(newsItem.description)
        .up()
        .ele('pubDate')
        .txt(newsItem.pubDate)
        .up()
        .ele('guid')
        .txt(newsItem.guid)
        .up()
        .ele('enclosure', { url: newsItem.imageUrl, type: 'image/jpeg' })
        .up()
    }

    const xmlString = feed.end({ prettyPrint: true })
    return xmlString
  }

  const rssXml = buildRSSFeed()

  res.header('Content-Type', 'application/xml')
  res.send(rssXml)

  res.status(200)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
