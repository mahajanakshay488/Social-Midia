var LucyName = ['Tokyo', 'The Professor', 'Nairobi', 'Berlin', 'Rio', 'Denver', 'Helsinki', 'Moscow'];

PickLucyname = () => {
   return LucyName[Math.floor(Math.random()*8)];
}

module.exports.PickLucyname = PickLucyname();