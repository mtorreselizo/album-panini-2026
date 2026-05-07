// FIFA World Cup 2026 Album Data - Panini Official
// 980 stickers total: 48 teams × 20 stickers + 20 FWC special = 980

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  group: string;
}

export interface Sticker {
  number: string;
  name: string;
  type: 'badge' | 'team_photo' | 'player' | 'special';
  teamId?: string;
}

export interface Section {
  id: string;
  name: string;
  type: 'intro' | 'team';
  stickers: Sticker[];
}

// All 48 teams organized by group (Official FIFA Draw)
export const teams: Team[] = [
  // GROUP A
  { id: 'mex', name: 'Mexico', code: 'MEX', flag: '🇲🇽', confederation: 'CONCACAF', group: 'A' },
  { id: 'rsa', name: 'Sudafrica', code: 'RSA', flag: '🇿🇦', confederation: 'CAF', group: 'A' },
  { id: 'kor', name: 'Corea del Sur', code: 'KOR', flag: '🇰🇷', confederation: 'AFC', group: 'A' },
  { id: 'cze', name: 'Chequia', code: 'CZE', flag: '🇨🇿', confederation: 'UEFA', group: 'A' },
  // GROUP B
  { id: 'can', name: 'Canada', code: 'CAN', flag: '🇨🇦', confederation: 'CONCACAF', group: 'B' },
  { id: 'bih', name: 'Bosnia-Herzegovina', code: 'BIH', flag: '🇧🇦', confederation: 'UEFA', group: 'B' },
  { id: 'qat', name: 'Catar', code: 'QAT', flag: '🇶🇦', confederation: 'AFC', group: 'B' },
  { id: 'sui', name: 'Suiza', code: 'SUI', flag: '🇨🇭', confederation: 'UEFA', group: 'B' },
  // GROUP C
  { id: 'bra', name: 'Brasil', code: 'BRA', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'C' },
  { id: 'mar', name: 'Marruecos', code: 'MAR', flag: '🇲🇦', confederation: 'CAF', group: 'C' },
  { id: 'hai', name: 'Haiti', code: 'HAI', flag: '🇭🇹', confederation: 'CONCACAF', group: 'C' },
  { id: 'sco', name: 'Escocia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', group: 'C' },
  // GROUP D
  { id: 'usa', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', confederation: 'CONCACAF', group: 'D' },
  { id: 'par', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'D' },
  { id: 'aus', name: 'Australia', code: 'AUS', flag: '🇦🇺', confederation: 'AFC', group: 'D' },
  { id: 'tur', name: 'Turquia', code: 'TUR', flag: '🇹🇷', confederation: 'UEFA', group: 'D' },
  // GROUP E
  { id: 'ger', name: 'Alemania', code: 'GER', flag: '🇩🇪', confederation: 'UEFA', group: 'E' },
  { id: 'cuw', name: 'Curazao', code: 'CUW', flag: '🇨🇼', confederation: 'CONCACAF', group: 'E' },
  { id: 'civ', name: 'Costa de Marfil', code: 'CIV', flag: '🇨🇮', confederation: 'CAF', group: 'E' },
  { id: 'ecu', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E' },
  // GROUP F
  { id: 'ned', name: 'Paises Bajos', code: 'NED', flag: '🇳🇱', confederation: 'UEFA', group: 'F' },
  { id: 'jpn', name: 'Japon', code: 'JPN', flag: '🇯🇵', confederation: 'AFC', group: 'F' },
  { id: 'swe', name: 'Suecia', code: 'SWE', flag: '🇸🇪', confederation: 'UEFA', group: 'F' },
  { id: 'tun', name: 'Tunez', code: 'TUN', flag: '🇹🇳', confederation: 'CAF', group: 'F' },
  // GROUP G
  { id: 'bel', name: 'Belgica', code: 'BEL', flag: '🇧🇪', confederation: 'UEFA', group: 'G' },
  { id: 'egy', name: 'Egipto', code: 'EGY', flag: '🇪🇬', confederation: 'CAF', group: 'G' },
  { id: 'irn', name: 'Iran', code: 'IRN', flag: '🇮🇷', confederation: 'AFC', group: 'G' },
  { id: 'nzl', name: 'Nueva Zelanda', code: 'NZL', flag: '🇳🇿', confederation: 'OFC', group: 'G' },
  // GROUP H
  { id: 'esp', name: 'Espana', code: 'ESP', flag: '🇪🇸', confederation: 'UEFA', group: 'H' },
  { id: 'cpv', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', confederation: 'CAF', group: 'H' },
  { id: 'ksa', name: 'Arabia Saudita', code: 'KSA', flag: '🇸🇦', confederation: 'AFC', group: 'H' },
  { id: 'uru', name: 'Uruguay', code: 'URU', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'H' },
  // GROUP I
  { id: 'fra', name: 'Francia', code: 'FRA', flag: '🇫🇷', confederation: 'UEFA', group: 'I' },
  { id: 'sen', name: 'Senegal', code: 'SEN', flag: '🇸🇳', confederation: 'CAF', group: 'I' },
  { id: 'irq', name: 'Irak', code: 'IRQ', flag: '🇮🇶', confederation: 'AFC', group: 'I' },
  { id: 'nor', name: 'Noruega', code: 'NOR', flag: '🇳🇴', confederation: 'UEFA', group: 'I' },
  // GROUP J
  { id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'J' },
  { id: 'alg', name: 'Argelia', code: 'ALG', flag: '🇩🇿', confederation: 'CAF', group: 'J' },
  { id: 'aut', name: 'Austria', code: 'AUT', flag: '🇦🇹', confederation: 'UEFA', group: 'J' },
  { id: 'jor', name: 'Jordania', code: 'JOR', flag: '🇯🇴', confederation: 'AFC', group: 'J' },
  // GROUP K
  { id: 'por', name: 'Portugal', code: 'POR', flag: '🇵🇹', confederation: 'UEFA', group: 'K' },
  { id: 'cod', name: 'R.D. Congo', code: 'COD', flag: '🇨🇩', confederation: 'CAF', group: 'K' },
  { id: 'uzb', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', confederation: 'AFC', group: 'K' },
  { id: 'col', name: 'Colombia', code: 'COL', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'K' },
  // GROUP L
  { id: 'eng', name: 'Inglaterra', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', group: 'L' },
  { id: 'cro', name: 'Croacia', code: 'CRO', flag: '🇭🇷', confederation: 'UEFA', group: 'L' },
  { id: 'gha', name: 'Ghana', code: 'GHA', flag: '🇬🇭', confederation: 'CAF', group: 'L' },
  { id: 'pan', name: 'Panama', code: 'PAN', flag: '🇵🇦', confederation: 'CONCACAF', group: 'L' },
];

// Team stickers data with real player names
const teamStickersData: Record<string, string[]> = {
  // GROUP A
  MEX: ['Escudo', 'Luis Malagon', 'Johan Vasquez', 'Jorge Sanchez', 'Cesar Montes', 'Jesus Gallardo', 'Israel Reyes', 'Diego Lainez', 'Carlos Rodriguez', 'Edson Alvarez', 'Orbelin Pineda', 'Marcel Ruiz', 'Foto Equipo', 'Erick Sanchez', 'Hirving Lozano', 'Santiago Gimenez', 'Raul Jimenez', 'Alexis Vega', 'Roberto Alvarado', 'Cesar Huerta'],
  RSA: ['Escudo', 'Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba', 'Samukele Kabini', 'Khuliso Mudau', 'Khulumani Ndamane', 'Siyabonga Ngezana', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha', 'Foto Equipo', 'Bathusi Aubaas', 'Yaya Sithole', 'Sipho Mbule', 'Lyle Foster', 'Iqraam Rayners', 'Mohau Nkota', 'Oswin Appollis'],
  KOR: ['Escudo', 'Hyeonwoo Jo', 'Seunggyu Kim', 'Minjae Kim', 'Yumin Cho', 'Youngwoo Seol', 'Hanbeom Lee', 'Taeseok Lee', 'Myungjae Lee', 'Jaesung Lee', 'Inbeom Hwang', 'Kangin Lee', 'Foto Equipo', 'Seungho Paik', 'Jens Castrop', 'Donggyeong Lee', 'Guesung Cho', 'Heungmin Son', 'Heechan Hwang', 'Hyeongyu Oh'],
  CZE: ['Escudo', 'Matej Kovar', 'Jindrich Stanek', 'Ladislav Krejci', 'Vladimir Coufal', 'Jan Boril', 'Robin Hranac', 'Martin Vitik', 'Tomas Soucek', 'Antonin Barak', 'Michal Sadilek', 'Lukas Provod', 'Foto Equipo', 'Alex Kral', 'David Doudera', 'Tomas Cvancara', 'Adam Hlozek', 'Mojmir Chytil', 'Patrik Schick', 'Jan Kuchta'],
  // GROUP B
  CAN: ['Escudo', 'Dayne St. Clair', 'Alphonso Davies', 'Alistair Johnston', 'Samuel Adekugbe', 'Samuel Richie Larvea', 'Derek Cornelius', 'Moise Bombito', 'Kamal Miller', 'Stephen Eustaquio', 'Ismael Kone', 'Jonathan Osorio', 'Foto Equipo', 'Jacob Shaffelburg', 'Mathieu Choiniere', 'Niko Sigur', 'Tajon Buchanan', 'Liam Millar', 'Dyle Larin', 'Jonathan David'],
  BIH: ['Escudo', 'Nikola Vasilj', 'Amar Dedic', 'Sead Kolasinac', 'Tarik Muharemovic', 'Nihad Mujakic', 'Nikola Katic', 'Amir Hadziahmetovic', 'Benjamin Tahirovic', 'Armin Gigovic', 'Ivan Sunjic', 'Ivan Basic', 'Foto Equipo', 'Dzenis Burnic', 'Esmir Bajraktarevic', 'Amar Memic', 'Ermedin Demirovic', 'Edin Dzeko', 'Samed Bazdar', 'Haris Tabakovic'],
  QAT: ['Escudo', 'Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes', 'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman', 'Mohammed Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Hamed Fatehi', 'Foto Equipo', 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al-Ganehi', 'Almoez Ali'],
  SUI: ['Escudo', 'Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji', 'Ricardo Rodriguez', 'Nico Elvedi', 'Aurele Amenda', 'Silvan Widmer', 'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder', 'Foto Equipo', 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer', 'Breel Embolo', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni'],
  // GROUP C
  BRA: ['Escudo', 'Alisson', 'Bento', 'Marquinhos', 'Eder Militao', 'Gabriel Magalhaes', 'Danilo', 'Wesley', 'Lucas Paqueta', 'Casemiro', 'Bruno Guimaraes', 'Luiz Henrique', 'Foto Equipo', 'Vinicius Junior', 'Rodrygo', 'Joao Pedro', 'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estevao'],
  MAR: ['Escudo', 'Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi', 'Noussair Mazraoui', 'Nayef Aguerd', 'Romain Saiss', 'Jawad El Yamiq', 'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir', 'Foto Equipo', 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri', 'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Diaz', 'Ayoub El Kaabi'],
  HAI: ['Escudo', 'Johny Placide', 'Carlens Arcus', 'Martin Experience', 'Jean-Kevin Duverne', 'Ricardo Ade', 'Duke Lacroix', 'Garven Metusala', 'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Foto Equipo', 'Christopher Attys', 'Derrick Etienne Jr.', 'Josue Casimir', 'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzdy Pierrot'],
  SCO: ['Escudo', 'Angus Gunn', 'Jack Hendry', 'Kieran Tierney', 'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar', 'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour', 'Foto Equipo', 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean', 'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Doak'],
  // GROUP D
  USA: ['Escudo', 'Matt Freese', 'Chris Richards', 'Tim Ream', 'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams', 'Tanner Tessmann', 'Weston McKennie', 'Christian Roldan', 'Timothy Weah', 'Foto Equipo', 'Diego Luna', 'Malik Tillman', 'Christian Pulisic', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun'],
  PAR: ['Escudo', 'Roberto Fernandez', 'Orlando Gill', 'Diego Gomez', 'Fabian Balbuena', 'Juan Jose Caceres', 'Omar Alderete', 'Junior Alonso', 'Mathias Villasanti', 'Diego Gomez', 'Damian Bobadilla', 'Andres Cubas', 'Foto Equipo', 'Matias Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra', 'Miguel Almiron', 'Ramon Sosa', 'Angel Romero', 'Antonio Sanabria'],
  AUS: ['Escudo', 'Mathew Ryan', 'Joe Gauci', 'Harry Souttar', 'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess', 'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree', 'Foto Equipo', 'Aiden O\'Neill', 'Connor Metcalfe', 'Patrick Yazbek', 'Craig Goodwin', 'Kusini Yengi', 'Nestory Irankunda', 'Mohamed Toure'],
  TUR: ['Escudo', 'Ugurcan Cakir', 'Mert Muldur', 'Zeki Celik', 'Abdulkerim Bardakci', 'Caglar Soyuncu', 'Merih Demiral', 'Ferdi Kadioglu', 'Kaan Ayhan', 'Ismail Yuksek', 'Hakan Calhanoglu', 'Orkun Kokcu', 'Foto Equipo', 'Arda Guler', 'Irfan Can Kahveci', 'Yunus Akgun', 'Can Uzun', 'Baris Alper Yilmaz', 'Kerem Akturkoglu', 'Kenan Yildiz'],
  // GROUP E
  GER: ['Escudo', 'Marc-Andre ter Stegen', 'Jonathan Tah', 'David Raum', 'Nico Schlotterbeck', 'Antonio Rudiger', 'Waldemar Anton', 'Ridle Baku', 'Maximilian Mittelstadt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha', 'Foto Equipo', 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry', 'Kai Havertz', 'Leroy Sane', 'Karim Adeyemi', 'Nick Woltemade'],
  CUW: ['Escudo', 'Eloy Room', 'Armando Obispo', 'Sherel Floranus', 'Jurien Gaari', 'Joshua Bremet', 'Roshon Van Eijma', 'Shurandy Sambo', 'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna', 'Foto Equipo', 'Tahith Chong', 'Kenji Gorre', 'Jearl Margaritha', 'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen'],
  CIV: ['Escudo', 'Yahia Fofana', 'Ghislain Konan', 'Wilfried Singo', 'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou', 'Ousmane Diomande', 'Franck Kessie', 'Seko Fofana', 'Ibrahim Sangare', 'Foto Equipo', 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sebastien Haller', 'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakite'],
  ECU: ['Escudo', 'Hernan Galindez', 'Gonzalo Valle', 'Piero Hincapie', 'Pervis Estupinan', 'Willian Pacho', 'Angelo Preciado', 'Joel Ordonez', 'Moises Caicedo', 'Alan Franco', 'Kendry Paez', 'Pedro Vite', 'Foto Equipo', 'John Yeboah', 'Leonardo Campana', 'Gonzalo Plata', 'Nilson Angulo', 'Alan Minda', 'Kevin Rodriguez', 'Enner Valencia'],
  // GROUP F
  NED: ['Escudo', 'Bart Verbruggen', 'Virgil van Dijk', 'Micky van de Ven', 'Jurien Timber', 'Denzel Dumfries', 'Nathan Ake', 'Jeremie Frimpong', 'Jan Paul van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners', 'Foto Equipo', 'Frenkie de Jong', 'Xavi Simons', 'Justin Kluivert', 'Memphis Depay', 'Donyel Malen', 'Wout Weghorst', 'Cody Gakpo'],
  JPN: ['Escudo', 'Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko', 'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano', 'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo', 'Foto Equipo', 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino', 'Shuto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda'],
  SWE: ['Escudo', 'Viktor Johansson', 'Isak Hien', 'Gabriel Gudmundsson', 'Emil Holm', 'Victor Nilsson Lindelof', 'Gustaf Lagerbielke', 'Lucas Bergvall', 'Hugo Larsson', 'Jesper Karlstrom', 'Yasin Ayari', 'Mattias Svanberg', 'Foto Equipo', 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji', 'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyokeres'],
  TUN: ['Escudo', 'Bechir Ben Said', 'Aymen Dahmen', 'Van Valery', 'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn', 'Ellyes Skhiri', 'Aissa Laidouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane', 'Foto Equipo', 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad', 'Hazem Mastouri', 'Ismael Gharbi', 'Sayfallah Ltaief', 'Naim Sliti'],
  // GROUP G
  BEL: ['Escudo', 'Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne', 'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier', 'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers', 'Foto Equipo', 'Hans Vanaken', 'Kevin De Bruyne', 'Jeremy Doku', 'Charles De Ketelaere', 'Leandro Trossard', 'Lois Openda', 'Romelu Lukaku'],
  EGY: ['Escudo', 'Mohamed Elshenawy', 'Mohamed Hany', 'Mohamed Hamdy', 'Yasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid', 'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy', 'Foto Equipo', 'Mohanad Lasheen', 'Emam Ashour', 'Osama Faisal', 'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush'],
  IRN: ['Escudo', 'Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi', 'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani', 'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos', 'Foto Equipo', 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi', 'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh'],
  NZL: ['Escudo', 'Max Crocombe', 'Alex Paulsen', 'Michael Boxall', 'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis de Vries', 'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas', 'Foto Equipo', 'Matthew Garbett', 'Marko Stamenic', 'Ben Old', 'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses'],
  // GROUP H
  ESP: ['Escudo', 'Unai Simon', 'Robin Le Normand', 'Aymeric Laporte', 'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella', 'Martin Zubimendi', 'Rodri', 'Pedri', 'Fabian Ruiz', 'Foto Equipo', 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo', 'Nico Williams', 'Ferran Torres', 'Alvaro Morata', 'Mikel Oyarzabal'],
  CPV: ['Escudo', 'Vozinha', 'Logan Costa', 'Pico', 'Dinev', 'Steven Moreira', 'Wagner Pina', 'Joao Paulo', 'Yannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro', 'Foto Equipo', 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral', 'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Beb'],
  KSA: ['Escudo', 'Nawaf Alaqidi', 'Abdulrahman Alsanbi', 'Saud Abdulhamid', 'Nawaf Bouwashl', 'Jehad Thikri', 'Moteb AlHarbi', 'Hassan Altambakti', 'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari', 'Foto Equipo', 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari', 'Abdulrahman Alobud', 'Feras Albrikan', 'Saleh Alshehri', 'Abdullah Alhamdan'],
  URU: ['Escudo', 'Sergio Rochet', 'Santiago Mele', 'Ronald Araujo', 'Jose Maria Gimenez', 'Sebastian Caceres', 'Mathias Olivera', 'Guillermo Varela', 'Nahitan Nandez', 'Federico Valverde', 'Giorgian de Arrascaeta', 'Rodrigo Bentancur', 'Foto Equipo', 'Manuel Ugarte', 'Nicolas de la Cruz', 'Maxi Araujo', 'Darwin Nunez', 'Federico Vinas', 'Rodrigo Aguirre', 'Facundo Pellistri'],
  // GROUP I
  FRA: ['Escudo', 'Mike Maignan', 'Theo Hernandez', 'William Saliba', 'Jules Kounde', 'Ibrahima Konate', 'Dayot Upamecano', 'Lucas Digne', 'Aurelien Tchouameni', 'Eduardo Camavinga', 'Manu Kone', 'Adrien Rabiot', 'Foto Equipo', 'Michael Olise', 'Ousmane Dembele', 'Bradley Barcola', 'Desire Doue', 'Kingsley Coman', 'Hugo Ekitike', 'Kylian Mbappe'],
  SEN: ['Escudo', 'Edouard Mendy', 'Yehvann Diouf', 'Moussa Niakhate', 'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly', 'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Pape Gueye', 'Habib Diarra', 'Foto Equipo', 'Lamine Camara', 'Sadio Mane', 'Ismaila Sarr', 'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta'],
  IRQ: ['Escudo', 'Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali', 'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis', 'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bavesh', 'Ali Jasim', 'Foto Equipo', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji', 'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali'],
  NOR: ['Escudo', 'Orjan Nyland', 'Julian Ryerson', 'Leo Ostigard', 'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Moller Wolfe', 'Torbjorn Heggem', 'Morten Thorsby', 'Martin Odegaard', 'Sander Berge', 'Andreas Schjelderup', 'Foto Equipo', 'Patrick Berg', 'Erling Haaland', 'Alexander Sorloth', 'Aron Donnum', 'Jorgen Strand Larsen', 'Antonio Musa', 'Oscar Bobb'],
  // GROUP J
  ARG: ['Escudo', 'Emiliano Martinez', 'Nahuel Molina', 'Cristian Romero', 'Nicolas Otamendi', 'Nicolas Tagliafico', 'Leonardo Balerdi', 'Enzo Fernandez', 'Alexis Mac Allister', 'Rodrigo de Paul', 'Exequiel Palacios', 'Leandro Paredes', 'Foto Equipo', 'Nico Paz', 'Franco Mastantuono', 'Nico Gonzalez', 'Lionel Messi', 'Lautaro Martinez', 'Julian Alvarez', 'Giuliano Simeone'],
  ALG: ['Escudo', 'Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal', 'Rayan Ait-Nouri', 'Mohamed Amine Tougai', 'Aissa Mandi', 'Ismael Bennacer', 'Houssem Aouar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentaleb', 'Foto Equipo', 'Fares Chaibi', 'Riyad Mahrez', 'Said Benrahma', 'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura'],
  AUT: ['Escudo', 'Alexander Schlager', 'Patrick Pentz', 'David Alaba', 'Kevin Danso', 'Philipp Lienhart', 'Stefan Bosch', 'Phillipp Mwene', 'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer', 'Foto Equipo', 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid', 'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautovic'],
  JOR: ['Escudo', 'Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish', 'Yazan Al-Arab', 'Abdullah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi', 'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', 'Foto Equipo', 'Amer Jamous', 'Mousa Al-Taamari', 'Yazan Al-Naimat', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra'],
  // GROUP K
  POR: ['Escudo', 'Diogo Costa', 'Jose Sa', 'Ruben Dias', 'Joao Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Goncalo Inacio', 'Bernardo Silva', 'Bruno Fernandes', 'Ruben Neves', 'Vitinha', 'Foto Equipo', 'Joao Neves', 'Cristiano Ronaldo', 'Francisco Trincao', 'Joao Felix', 'Goncalo Ramos', 'Pedro Neto', 'Rafael Leao'],
  COD: ['Escudo', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe', 'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kavembe', 'Charles Pickel', 'Ngal\'ayel Mukau', 'Edo Kavembe', 'Samuel Moutoussamy', 'Noah Sadiki', 'Foto Equipo', 'Theo Bongonda', 'Meschack Elia', 'Yoane Wissa', 'Brian Cipenga', 'Fiston Mavele', 'Cedric Bakambu', 'Nathanael Mbuku'],
  UZB: ['Escudo', 'Utkir Yusupov', 'Farrukh Sayfiev', 'Sherzod Nasrullaev', 'Umar Eshmurodov', 'Husniddin Aliqulov', 'Rustam Ashurmatov', 'Khojiakbar Alijonov', 'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Foto Equipo', 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov', 'Oston Urunov', 'Jaloliddin Masharipov', 'Abdurauf Buriev', 'Igor Sergeev'],
  COL: ['Escudo', 'Camilo Vargas', 'David Ospina', 'Davinson Sanchez', 'Yerry Mina', 'Daniel Munoz', 'Johan Mojica', 'Jhon Lucumi', 'Santiago Arias', 'Jefferson Lerma', 'Kevin Castano', 'Richard Rios', 'Foto Equipo', 'James Rodriguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Jhon Arias', 'Jhon Cordova', 'Luis Suarez', 'Luis Diaz'],
  // GROUP L
  ENG: ['Escudo', 'Jordan Pickford', 'John Stones', 'Marc Guehi', 'Ezri Konsa', 'Trent Alexander-Arnold', 'Reece James', 'Dan Burn', 'Jordan Henderson', 'Declan Rice', 'Jude Bellingham', 'Cole Palmer', 'Foto Equipo', 'Morgan Rogers', 'Anthony Gordon', 'Phil Foden', 'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Ollie Watkins'],
  CRO: ['Escudo', 'Dominik Livakovic', 'Duje Caleta-Car', 'Josko Gvardiol', 'Josip Stanisic', 'Luka Vuskovic', 'Josip Sutalo', 'Kristijan Jakic', 'Luka Modric', 'Mateo Kovacic', 'Martin Baturina', 'Lovro Majer', 'Foto Equipo', 'Mario Pasalic', 'Petar Sucic', 'Ivan Perisic', 'Marco Pasalic', 'Ante Budimir', 'Andrej Kramaric', 'Franjo Ivanovic'],
  GHA: ['Escudo', 'Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu', 'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Yirenkyi', 'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana', 'Foto Equipo', 'Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew', 'Andre Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo'],
  PAN: ['Escudo', 'Orlando Mosquera', 'Luis Mejia', 'Fidel Escobar', 'Andres Andrade', 'Michael Amir Murillo', 'Eric Davies', 'Jose Cordoba', 'Cesar Blackman', 'Cristian Martin', 'Anibal Godoy', 'Adalberto Carrasquilla', 'Foto Equipo', 'Edgar Barcenas', 'Carlos Harvey', 'Ismael Diaz', 'Jose Fajardo', 'Cecilio Waterman', 'Jose Luis Rodriguez', 'Alberto Quintero'],
};

// Generate stickers for a team using the real player data
function generateTeamStickers(team: Team): Sticker[] {
  const data = teamStickersData[team.code];
  if (!data) return [];
  
  return data.map((name, index) => {
    const num = index + 1;
    let type: Sticker['type'] = 'player';
    if (num === 1) type = 'badge';
    else if (num === 13) type = 'team_photo';
    
    return {
      number: `${team.code}${num}`,
      name,
      type,
      teamId: team.id,
    };
  });
}

// Special stickers (FWC section) - 20 stickers
const introStickers: Sticker[] = [
  { number: '00', name: 'Logo Panini', type: 'special' },
  { number: 'FWC1', name: 'Logo Mundial - Parte Superior', type: 'special' },
  { number: 'FWC2', name: 'Logo Mundial - Parte Inferior', type: 'special' },
  { number: 'FWC3', name: 'Mascotas Oficiales', type: 'special' },
  { number: 'FWC4', name: 'Eslogan Oficial', type: 'special' },
  { number: 'FWC5', name: 'Balon Oficial', type: 'special' },
  { number: 'FWC6', name: 'Canada - Emblema Pais Sede', type: 'special' },
  { number: 'FWC7', name: 'Mexico - Emblema Pais Sede', type: 'special' },
  { number: 'FWC8', name: 'USA - Emblema Pais Sede', type: 'special' },
  { number: 'FWC9', name: 'Italia - Mundial Italia 1934', type: 'special' },
  { number: 'FWC10', name: 'Uruguay - Mundial Brasil 1950', type: 'special' },
  { number: 'FWC11', name: 'Alemania - Mundial Suiza 1954', type: 'special' },
  { number: 'FWC12', name: 'Brasil - Mundial Chile 1962', type: 'special' },
  { number: 'FWC13', name: 'Alemania - Mundial Alemania 1974', type: 'special' },
  { number: 'FWC14', name: 'Argentina - Mundial Mexico 1986', type: 'special' },
  { number: 'FWC15', name: 'Brasil - Mundial USA 1994', type: 'special' },
  { number: 'FWC16', name: 'Brasil - Mundial Corea-Japon 2002', type: 'special' },
  { number: 'FWC17', name: 'Italia - Mundial Alemania 2006', type: 'special' },
  { number: 'FWC18', name: 'Alemania - Mundial Brasil 2014', type: 'special' },
  { number: 'FWC19', name: 'Argentina - Mundial Catar 2022', type: 'special' },
];

// Build all sections
export const sections: Section[] = [
  {
    id: 'intro',
    name: 'FWC',
    type: 'intro',
    stickers: introStickers,
  },
  ...teams.map(team => ({
    id: team.id,
    name: team.name,
    type: 'team' as const,
    stickers: generateTeamStickers(team),
  })),
];

// Get all stickers flat
export const allStickers: Sticker[] = sections.flatMap(s => s.stickers);

// Total sticker count
export const totalStickerCount = allStickers.length;

// Confederations for filtering
export const confederations = [
  { id: 'all', name: 'Todos' },
  { id: 'CONCACAF', name: 'CONCACAF' },
  { id: 'CONMEBOL', name: 'CONMEBOL' },
  { id: 'UEFA', name: 'UEFA' },
  { id: 'AFC', name: 'AFC' },
  { id: 'CAF', name: 'CAF' },
  { id: 'OFC', name: 'OFC' },
];

// Groups for filtering
export const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
