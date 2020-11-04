const Player = require('../../schema/Player')
const PDFExtract = require('pdf.js-extract').PDFExtract;

const pdfExtract = new PDFExtract();
const options = {};

const playerResolver = {
    Query: {
      players: async() => {
        try {
          const players = await Player.find()
          return players
        } catch(err) {
          throw err
        }
      },

      goalkeepers: async() => {
        try {
          const goalkeepers = await Player.find({ role: "P" })
          return goalkeepers
        } catch(err) {
          console.log(err)
          throw err
        }
      },

      defenders: async() => {
        try {
          const defenders = await Player.find({ role: "D" })
          return defenders
        } catch(err) {
          console.log(err)
          throw err
        }
      },

      midfielders: async() => {
        try {
          const goalkeepers = await Player.find({ role: "C" })
          return goalkeepers
        } catch(err) {
          console.log(err)
          throw err
        }
      },

      strikers: async() => {
        try {
          const goalkeepers = await Player.find({ role: "A" })
          return goalkeepers
        } catch(err) {
          console.log(err)
          throw err
        }
      },


    },

    Mutation: {
      addAllSeasonPlayers: async(_, __) => {
        try {
          pdfExtract.extract('giocatori-001.pdf', options, async(err, data) => {
            let finalData = []
            if (err) return console.log(err);
      
            const singlePageContent = (page) => {
      
                let tempArray = []
                let formattedArray = []
          
               page.content.forEach(item => {
                    tempArray.push(item)
                    if(tempArray.length === 6){
                      formattedArray.push(tempArray)
                        tempArray = []
                    }
                })
          
                formattedArray.shift()
                formattedArray.pop()
                
                const pagePLayers = formattedArray.map(item => {
                  const role = item[0].str
                  const lastName = item[1].str
                  const firstName = item[2].str
                  const team = item[3].str
                  return {
                      name: `${firstName} ${lastName}`,
                      role,
                      team
                   }
                })
      
                finalData.push(...pagePLayers)
            }
      
            data.pages.forEach(page => singlePageContent(page))

            console.log(finalData)

            await Player.insertMany(finalData)

          });

          return 'complete'

        } catch(err) {
          console.log(err)
          throw err
        }
      }
    }
};

module.exports = playerResolver