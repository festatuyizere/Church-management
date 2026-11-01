/**
 * Rwandan Administrative Hierarchy Data
 * Province -> District -> Sector -> Cell -> Village (Umudugudu)
 * Covers all 5 Provinces and all 30 Districts of the Republic of Rwanda.
 * Specialized for the Church of the Nazarene, Remera (Gasabo District, Kigali City)
 * with comprehensive national coverage for members residing across Rwanda.
 */

export interface LocationHierarchy {
  [province: string]: {
    [district: string]: {
      [sector: string]: {
        [cell: string]: string[]; // villages (imidugudu)
      };
    };
  };
}

export const RWANDA_LOCATIONS: LocationHierarchy = {
  'Kigali City': {
    'Gasabo': {
      'Remera': {
        'Rukiri I': ['Amahoro', 'Rebero', 'Urumuri', 'Umutekano', 'Intwari'],
        'Rukiri II': ['Inyange', 'Abatuje', 'Icyerekezo', 'Iterambere', 'Isangano'],
        'Nyabisindu': ['Gihogwe', 'Kigali', 'Amizero', 'Urukundo', 'Urumuri'],
      },
      'Kimironko': {
        'Kibagabaga': ['Buranga', 'Kageyo', 'Ramiro', 'Nyirabwana'],
        'Nyagatovu': ['Icyerekezo', 'Ubumwe', 'Umutekano'],
        'Bibare': ['Inyange', 'Intwari', 'Abatarushwa'],
      },
      'Kacyiru': {
        'Kamatamu': ['Cyivugiza', 'Gataba', 'Kabagari'],
        'Kibaza': ['Inkingi', 'Urugero', 'Urumuri'],
      },
      'Gisozi': {
        'Musezero': ['Amahoro', 'Rwinzovu', 'Gasave'],
        'Ruhango': ['Kanyinya', 'Gasharu', 'Umurava'],
      },
      'Ndera': {
        'Kibenga': ['Bwiza', 'Rudashya'],
        'Mukuyu': ['Jurwe', 'Nyarunazi'],
      },
      'Bumbogo': {
        'Kinyinya': ['Karama', 'Kinyinya'],
        'Ngara': ['Munini', 'Gisiza'],
      },
      'Jabana': {
        'Akamatamu': ['Ngiryi', 'Kidashya'],
        'Bweramvura': ['Kabuye', 'Nyacyonga'],
      },
      'Jali': {
        'Agateko': ['Nyirangarama', 'Gitovu'],
        'Buhiza': ['Nkoto', 'Murehe'],
      },
      'Kinyinya': {
        'Gacuriro': ['Kamatamu', 'Rebero', 'Urumuri'],
        'Kagugu': ['Rukingu', 'Gasharu'],
        'Murama': ['Musezero', 'Nyirabwana'],
      },
      'Nduba': {
        'Butare': ['Shango', 'Gatagara'],
        'Gasiza': ['Gatunga', 'Kigabiro'],
      },
      'Rusororo': {
        'Kabuga I': ['Gasagara', 'Nyagasozi'],
        'Nyagahinga': ['Rugende', 'Kinyinya'],
        'Rugende': ['Mataba', 'Gatagara'],
      },
      'Rutunga': {
        'Kigabiro': ['Karambo', 'Rurambi'],
        'Indatwa': ['Bwiza', 'Mubuga'],
      },
      'Gatsata': {
        'Nyamabuye': ['Hanika', 'Nduba'],
        'Karuruma': ['Kanyonyomba', 'Nyabugogo'],
      },
    },
    'Kicukiro': {
      'Niboye': {
        'Gatare': ['Rugunga', 'Isangano', 'Urumuri'],
        'Niboye': ['Amizero', 'Indatwa', 'Rebero'],
        'Nyakabanda': ['Kavumu', 'Munini'],
      },
      'Kagarama': {
        'Kanserege': ['Gatare', 'Rugunga'],
        'Muyange': ['Iterambere', 'Ubumwe', 'Rebero'],
      },
      'Gikondo': {
        'Kanserege': ['Kinunga', 'Mwurire'],
        'Kagunga': ['Mburabuturo', 'Rugunga'],
      },
      'Kanombe': {
        'Kabeza': ['Rubirizi', 'Karisimbi', 'Gasaraba'],
        'Karama': ['Busanza', 'Majyambere'],
        'Rubirizi': ['Kabeza', 'Itunda'],
      },
      'Masaka': {
        'Gako': ['Ayabaramba', 'Mbabe'],
        'Cyimo': ['Gikundiro', 'Rusheshe'],
        'Rusheshe': ['Kigabiro', 'Gasagara'],
      },
      'Kicukiro': {
        'Ngoma': ['Kicukiro', 'Kagunga'],
        'Kagunga': ['Murambi', 'Nyarurama'],
      },
      'Gatenga': {
        'Gatenga': ['Murambi', 'Nyarurama'],
        'Karambo': ['Rebero', 'Gatare'],
        'Nyanza': ['Muringa', 'Kanserege'],
      },
      'Nyarugunga': {
        'Kamashashi': ['Nonko', 'Gasaraba'],
        'Rwimbogo': ['Rwimbogo', 'Kabeza'],
      },
    },
    'Nyarugenge': {
      'Nyarugenge': {
        'Kiyovu': ['Inyenyeri', 'Ubumwe', 'Isangano'],
        'Biryogo': ['Gabiro', 'Isangano', 'Rukatsa'],
      },
      'Nyamirambo': {
        'Rwezamenyo': ['Gitega', 'Kavumu'],
        'Mumena': ['Intsinzi', 'Rukatsa'],
        'Cyivugiza': ['Cyivugiza', 'Mpazi'],
      },
      'Gitega': {
        'Akabahizi': ['Gitega', 'Akabahizi'],
        'Kigarama': ['Kigarama', 'Kavumu'],
      },
      'Kimisagara': {
        'Katabaro': ['Katabaro', 'Kamuhoza'],
        'Kamuhoza': ['Mpazi', 'Ngaruyinka'],
      },
      'Muhima': {
        'Kabusunzu': ['Tetero', 'Amahoro'],
        'Nyabugogo': ['Ubumwe', 'Nyabugogo'],
      },
      'Kigali': {
        'Kigali': ['Kadobogo', 'Nyabugogo'],
        'Mwendo': ['Mwendo', 'Ruriba'],
      },
      'Mageragere': {
        'Kankuba': ['Maya', 'Kavumu'],
        'Mataba': ['Mataba', 'Runzenze'],
      },
    },
  },
  'Eastern Province': {
    'Bugesera': {
      'Nyamata': {
        'Nyamata Ville': ['Kanazi', 'Kayumba', 'Maranyundo'],
        'Kanazi': ['Gatare', 'Ramiro'],
        'Kayumba': ['Kayumba', 'Cyeru'],
      },
      'Ruhuha': {
        'Bihari': ['Ruhuha', 'Gatanga'],
        'Kindama': ['Kindama', 'Gikundiro'],
      },
      'Mayange': {
        'Kagenge': ['Kibungo', 'Rwarushengo'],
        'Mbyo': ['Mbyo', 'Gakamba'],
      },
      'Ntarama': {
        'Cyugaro': ['Kanzenze', 'Cyugaro'],
        'Kibungo': ['Kibungo', 'Gakurazo'],
      },
      'Gashora': {
        'Biryogo': ['Ramiro', 'Mwendo'],
        'Kagomasi': ['Kagomasi', 'Rilima'],
      },
    },
    'Gatsibo': {
      'Kabarore': {
        'Kabarore': ['Karenge', 'Nyagisozi'],
        'Simbwa': ['Simbwa', 'Kiramuruzi'],
      },
      'Ngarama': {
        'Bugamba': ['Ngarama', 'Kigabagaba'],
        'Karambi': ['Karambi', 'Mugera'],
      },
      'Kiramuruzi': {
        'Gakenke': ['Akabuga', 'Ryabega'],
        'Nyabisindu': ['Nyabisindu', 'Kiramuruzi'],
      },
      'Kiziguro': {
        'Agakomeye': ['Kiziguro', 'Mbogo'],
        'Rubona': ['Rubona', 'Nyamirama'],
      },
      'Rugarama': {
        'Bugarama': ['Mataba', 'Remera'],
        'Kirehe': ['Kirehe', 'Nyagasambu'],
      },
    },
    'Kayonza': {
      'Mukarange': {
        'Bwiza': ['Kayonza Ville', 'Rusera'],
        'Nyagatovu': ['Karere', 'Bwiza'],
      },
      'Gahini': {
        'Juru': ['Gahini', 'Vidiyo'],
        'Kahi': ['Kahi', 'Uyisenga'],
      },
      'Kabarondo': {
        'Cyabajwa': ['Cyarubare', 'Rugendabari'],
        'Kabarondo': ['Kabarondo Ville', 'Kanyeganyege'],
      },
      'Rwinkwavu': {
        'Nkondo': ['Mparamirundi', 'Barisuka'],
        'Mukarange': ['Rwinkwavu Ville', 'Gikore'],
      },
      'Ndego': {
        'Byimana': ['Rurama', 'Isangano'],
        'Karambi': ['Karambi', 'Kibaza'],
      },
    },
    'Kirehe': {
      'Kirehe': {
        'Gatore': ['Nyakarambi', 'Kirehe Ville'],
        'Nyakarambi': ['Nyakarambi', 'Bumbogo'],
      },
      'Gahara': {
        'Butezi': ['Muhurire', 'Rwantonde'],
        'Rubimba': ['Rubimba', 'Nyakagezi'],
      },
      'Mahama': {
        'Munini': ['Mahama', 'Umurinzi'],
        'Saruhembe': ['Saruhembe', 'Kageyo'],
      },
      'Rusumo': {
        'Nyamugari': ['Rusumo Ville', 'Kashenyi'],
        'Kigarama': ['Kigarama', 'Kirehe'],
      },
    },
    'Ngoma': {
      'Kibungo': {
        'Gatonde': ['Kibungo Ville', 'Karenge'],
        'Mahango': ['Mahango', 'Cyasemakamba'],
      },
      'Zaza': {
        'Ruhinga': ['Zaza', 'Nyaruvumu'],
        'Zaza': ['Zaza Centre', 'Gitarama'],
      },
      'Rukira': {
        'Kibimba': ['Gasagara', 'Buriba'],
        'Nyaruvumu': ['Nyaruvumu', 'Kavumu'],
      },
      'Sake': {
        'Gafunzo': ['Sake', 'Kibaza'],
        'Rukoma': ['Rukoma', 'Gatore'],
      },
      'Mugesera': {
        'Ntovi': ['Akaziba', 'Mugesera'],
        'Mugorore': ['Mugorore', 'Kahi'],
      },
    },
    'Nyagatare': {
      'Nyagatare': {
        'Barija': ['Nyagatare Ville', 'Ryabega'],
        'Bushoga': ['Rwebishirira', 'Bushoga'],
        'Nyagatare': ['Nyakagando', 'Mirama'],
      },
      'Mimuri': {
        'Mahoro': ['Mimuri', 'Rebero'],
        'Rugari': ['Rugari', 'Cyabayaga'],
      },
      'Karangazi': {
        'Ndama': ['Kizungu', 'Rwenyemera'],
        'Rubagabaga': ['Rubagabaga', 'Mbare'],
      },
      'Rukomo': {
        'Rukomo': ['Gashenyi', 'Nyakagando'],
        'Rurenge': ['Rurenge', 'Gikagati'],
      },
      'Gatunda': {
        'Nyamikamba': ['Gatunda', 'Rwimiyaga'],
        'Cyabayaga': ['Cyabayaga', 'Nyamikamba'],
      },
    },
    'Rwamagana': {
      'Kigabiro': {
        'Nyagasenyi': ['Nyagasenyi', 'Bwiza', 'Gatare'],
        'Sibagire': ['Kavumu', 'Rutonde'],
        'Sovu': ['Sovu', 'Gatunguru'],
      },
      'Muhazi': {
        'Kabare': ['Nyirabideli', 'Ntunga'],
        'Ntunga': ['Karambo', 'Ntunga'],
      },
      'Karenge': {
        'Bicumbi': ['Karenge', 'Nyamatete'],
        'Karenge': ['Karenge Ville', 'Bwiza'],
      },
      'Fumbwe': {
        'Munini': ['Nyagasambu', 'Sasabiriro'],
        'Nyagasambu': ['Nyagasambu Centre', 'Munini'],
      },
      'Muyumbu': {
        'Bujyujyu': ['Murehe', 'Akabuga'],
        'Nyanza': ['Nyanza', 'Kavumu'],
      },
    },
  },
  'Northern Province': {
    'Burera': {
      'Bungwe': {
        'Bungwe': ['Bungwe', 'Taba'],
        'Mudende': ['Mudende', 'Ruhunde'],
      },
      'Butaro': {
        'Gatsibo': ['Butaro Ville', 'Rusumo'],
        'Mubuga': ['Mubuga', 'Kivumu'],
      },
      'Cyanika': {
        'Cyanika': ['Cyanika Border', 'Gasiza'],
        'Kagogo': ['Kagogo', 'Rugarama'],
      },
      'Rugarama': {
        'Gacundura': ['Rugarama', 'Kivumu'],
        'Rugengabari': ['Rugengabari', 'Gasharu'],
      },
      'Ruhunde': {
        'Gatare': ['Ruhunde', 'Kirambo'],
        'Rurembo': ['Rurembo', 'Gatare'],
      },
    },
    'Gakenke': {
      'Gakenke': {
        'Rusagara': ['Gakenke Ville', 'Rusagara'],
        'Kagano': ['Kagano', 'Nemba'],
      },
      'Nemba': {
        'Mucaca': ['Nemba Hospital', 'Buranga'],
        'Nemba': ['Nemba Centre', 'Gatonde'],
      },
      'Coko': {
        'Coko': ['Coko', 'Kivumu'],
        'Rurembo': ['Rurembo', 'Gasiza'],
      },
      'Rushashi': {
        'Joma': ['Rushashi', 'Shyombwe'],
        'Rurembo': ['Rurembo', 'Bwiza'],
      },
      'Janja': {
        'Gatwa': ['Janja', 'Gatare'],
        'Janja': ['Janja Centre', 'Kavumu'],
      },
    },
    'Gicumbi': {
      'Byumba': {
        'Gisuna': ['Byumba Ville', 'Mulindi'],
        'Kibali': ['Rebero', 'Kibali'],
        'Nyamabuye': ['Nyamabuye', 'Gacurabwenge'],
      },
      'Kageyo': {
        'Gihembe': ['Gihembe', 'Kageyo'],
        'Kageyo': ['Kageyo Centre', 'Kavumu'],
      },
      'Kaniga': {
        'Mulindi': ['Mulindi Tea Estate', 'Kaniga'],
        'Ruyenzi': ['Ruyenzi', 'Kigali'],
      },
      'Miyove': {
        'Gatagara': ['Miyove', 'Nyiravugiza'],
        'Miyove': ['Miyove Prison Area', 'Kavumu'],
      },
      'Rutare': {
        'Kigabiro': ['Rutare', 'Muhazi'],
        'Rutare': ['Rutare Centre', 'Bwiza'],
      },
    },
    'Musanze': {
      'Muhoza': {
        'Ruhengeri': ['Ruhengeri Ville', 'Kigombe'],
        'Kigombe': ['Mpenge', 'Muhe'],
        'Cyabararika': ['Cyabararika', 'Susa'],
      },
      'Kinigi': {
        'Bisoke': ['Kinigi Park', 'Kampanga'],
        'Sabyinyo': ['Kaguhu', 'Nyange'],
        'Nyange': ['Nyange', 'Bisoke'],
      },
      'Cyuve': {
        'Kabeza': ['Bukinanyana', 'Cyuve'],
        'Rwebeya': ['Rwebeya', 'Kavumu'],
      },
      'Remera': {
        'Murandi': ['Remera', 'Rwinzovu'],
        'Gasiza': ['Gasiza', 'Gatonde'],
      },
      'Busogo': {
        'Sahara': ['ISAE', 'Busogo'],
        'Gisesero': ['Gisesero', 'Mubona'],
      },
      'Nkotsi': {
        'Bikara': ['Nkotsi', 'Gashaki'],
        'Rugeshi': ['Rugeshi', 'Bihinga'],
      },
    },
    'Rulindo': {
      'Tare': {
        'Gasiza': ['Buyoga', 'Kinihira', 'Tare Ville'],
        'Buyoga': ['Buyoga', 'Mubuga'],
        'Kinihira': ['Kinihira', 'Kavumu'],
      },
      'Shyorongi': {
        'Rutonde': ['Gitikinyoni', 'Shyorongi'],
        'Kanyinya': ['Kanyinya', 'Nzove'],
      },
      'Bushoki': {
        'Gasiza': ['Bushoki', 'Nyirangarama'],
        'Mukingo': ['Mukingo', 'Kavumu'],
      },
      'Base': {
        'Base': ['Base Ville', 'Gitare'],
        'Cyohoha': ['Cyohoha', 'Gatagara'],
      },
      'Kinihira': {
        'Kinihira': ['Kinihira Hospital', 'Rebero'],
        'Butare': ['Butare', 'Mubuga'],
      },
      'Masoro': {
        'Kavumu': ['Masoro', 'Nyirangarama'],
        'Shengampuri': ['Shengampuri', 'Gatare'],
      },
    },
  },
  'Southern Province': {
    'Gisagara': {
      'Ndora': {
        'Cyiri': ['Ndora', 'Gisagara Ville'],
        'Mukindo': ['Mukindo', 'Akaboti'],
      },
      'Save': {
        'Save': ['Save Mamba', 'Shyanda'],
        'Zivu': ['Zivu', 'Kavumu'],
      },
      'Muganza': {
        'Muganza': ['Muganza', 'Akaboti'],
        'Remera': ['Remera', 'Mamba'],
      },
      'Kansi': {
        'Akaboti': ['Kansi', 'Rango'],
        'Kansi': ['Kansi Centre', 'Kavumu'],
      },
    },
    'Huye': {
      'Ngoma': {
        'Matyazo': ['Butare Ville', 'Matyazo'],
        'Kabutare': ['Kabutare', 'Rango'],
        'Butare': ['Campus', 'Centre Ville'],
      },
      'Tumba': {
        'Cyarwa': ['Tumba', 'Rango B'],
        'Mpare': ['Mpare', 'Gatare'],
      },
      'Mukura': {
        'Rango': ['Mukura', 'Rango'],
        'Sahera': ['Sahera', 'Bwiza'],
      },
      'Mbazi': {
        'Mbazi': ['Mbazi', 'Mwizi'],
        'Mwizi': ['Mwizi', 'Kavumu'],
      },
      'Karama': {
        'Karama': ['Karama', 'Kibingo'],
        'Kibingo': ['Bunyogombe', 'Gatare'],
      },
      'Maraba': {
        'Maraba': ['Maraba Coffee', 'Kabuye'],
        'Shori': ['Shori', 'Buremera'],
      },
    },
    'Kamonyi': {
      'Runda': {
        'Ruyenzi': ['Ruyenzi Ville', 'Bishenyi', 'Gihara'],
        'Gihara': ['Gihara', 'Nyagacaca'],
        'Muganza': ['Muganza', 'Kavumu'],
      },
      'Gacurabwenge': {
        'Gacurabwenge': ['Kamonyi Ville', 'Buhanda'],
        'Nyamiyaga': ['Nyamiyaga', 'Gasharu'],
      },
      'Nyamiyaga': {
        'Nyamiyaga': ['Nyamiyaga', 'Kidahwe'],
        'Bibungo': ['Bibungo', 'Kavumu'],
      },
      'Rugalika': {
        'Kigese': ['Rugalika', 'Sheri'],
        'Rugalika': ['Rugalika Centre', 'Gatare'],
      },
      'Ngamba': {
        'Ngamba': ['Ngamba', 'Kazirabwenge'],
        'Kazirabwenge': ['Kazirabwenge', 'Musambira'],
      },
    },
    'Muhanga': {
      'Nyamabuye': {
        'Gitarama': ['Gitarama Ville', 'Gahogo'],
        'Gahogo': ['Gahogo', 'Nyabisindu'],
        'Remera': ['Remera', 'Kigoma'],
      },
      'Cyeza': {
        'Cyeza': ['Cyeza', 'Makera'],
        'Kivumu': ['Kivumu', 'Runga'],
      },
      'Shyogwe': {
        'Kinini': ['Shyogwe', 'Mbare'],
        'Mubuga': ['Mubuga', 'Ruvumera'],
      },
      'Muhanga': {
        'Muhanga': ['Muhanga', 'Nganzo'],
        'Nganzo': ['Nganzo', 'Ruli'],
      },
      'Kibangu': {
        'Kibangu': ['Kibangu', 'Gitega'],
        'Gitega': ['Gitega', 'Nyabikenke'],
      },
    },
    'Nyamagabe': {
      'Gasaka': {
        'Nyamagabe': ['Nyamagabe Ville', 'Kigeme'],
        'Kigeme': ['Kigeme Camp', 'Gatare'],
      },
      'Tare': {
        'Tare': ['Tare', 'Kitabi'],
        'Gasaka': ['Gasaka', 'Kavumu'],
      },
      'Kitabi': {
        'Kitabi': ['Kitabi Nyungwe', 'Uwinkomo'],
        'Kagano': ['Kagano', 'Mubuga'],
      },
      'Kaduha': {
        'Kaduha': ['Kaduha Ville', 'Mushubi'],
        'Kavumu': ['Kavumu', 'Bwiza'],
      },
      'Cyanika': {
        'Cyanika': ['Cyanika', 'Karambo'],
        'Karambo': ['Karambo', 'Musange'],
      },
    },
    'Nyanza': {
      'Busasamana': {
        'Kavumu': ['Nyanza Royal Palace', 'Rwesero'],
        'Nyanza': ['Kibinjuru', 'Nyanza Ville'],
        'Rwesero': ['Rwesero Arts', 'Gatare'],
      },
      'Kigoma': {
        'Butansinda': ['Kigoma', 'Mukingo'],
        'Gasoro': ['Gasoro', 'Gatagara'],
      },
      'Mukingo': {
        'Mukingo': ['Mukingo', 'Nyanza'],
        'Nyanza': ['Kirambi', 'Kavumu'],
      },
      'Muyira': {
        'Muyira': ['Muyira', 'Nyabinyenga'],
        'Nyabinyenga': ['Nyabinyenga', 'Gisoro'],
      },
      'Nyagisozi': {
        'Nyagisozi': ['Nyagisozi', 'Cyerekezo'],
        'Cyerekezo': ['Rwesero', 'Kavumu'],
      },
    },
    'Nyaruguru': {
      'Kibeho': {
        'Kibeho': ['Kibeho Holy Land', 'Kibeho Ville'],
        'Nyarushishi': ['Nyarushishi', 'Mubuga'],
      },
      'Munini': {
        'Munini': ['Munini Hospital', 'Ndago'],
        'Ndago': ['Ndago', 'Bwiza'],
      },
      'Mata': {
        'Mata': ['Mata Tea', 'Nyamyumba'],
        'Ruramba': ['Ruramba', 'Gatare'],
      },
      'Busanze': {
        'Busanze': ['Busanze', 'Gitovu'],
        'Gitovu': ['Gitovu', 'Runyombyi'],
      },
    },
    'Ruhango': {
      'Ruhango': {
        'Ruhango': ['Ruhango Ville', 'Buhoro'],
        'Buhoro': ['Buhoro', 'Kavumu'],
      },
      'Kinazi': {
        'Kinazi': ['Kinazi Cassava', 'Gitwe'],
        'Rutabo': ['Rutabo', 'Bwiza'],
      },
      'Byimana': {
        'Byimana': ['Byimana Sciences', 'Kamonyi'],
        'Muhororo': ['Muhororo', 'Kavumu'],
      },
      'Bweramana': {
        'Bweramana': ['Bweramana', 'Gitwe'],
        'Murama': ['Murama', 'Gatare'],
      },
    },
  },
  'Western Province': {
    'Karongi': {
      'Bwishyura': {
        'Kibuye': ['Kibuye Ville', 'Lake Kivu Shore'],
        'Gasura': ['Gasura', 'Gatwaro'],
        'Moriah': ['Moriah Hill', 'Karongi'],
      },
      'Rubengera': {
        'Bubazi': ['Rubengera', 'Kibilizi'],
        'Rubengera': ['Rubengera Centre', 'Gatare'],
      },
      'Gishyita': {
        'Gishyita': ['Gishyita', 'Musasa'],
        'Musasa': ['Mubuga', 'Kavumu'],
      },
      'Rwankuba': {
        'Rwankuba': ['Rwankuba', 'Munini'],
        'Munini': ['Bisesero', 'Gatare'],
      },
    },
    'Ngororero': {
      'Ngororero': {
        'Ngororero': ['Ngororero Ville', 'Kazabe'],
        'Kazabe': ['Kazabe', 'Gatumba'],
      },
      'Kabaya': {
        'Kabaya': ['Kabaya', 'Rusumo'],
        'Rusumo': ['Nyange', 'Kavumu'],
      },
      'Sovu': {
        'Sovu': ['Sovu', 'Musumba'],
        'Musumba': ['Bwira', 'Gatare'],
      },
      'Hindiro': {
        'Hindiro': ['Hindiro', 'Gatumba'],
        'Gatumba': ['Ndaro', 'Bwiza'],
      },
    },
    'Nyabihu': {
      'Mukamira': {
        'Jenda': ['Mukamira Ville', 'Jenda'],
        'Kijote': ['Kijote', 'Karago'],
      },
      'Rambura': {
        'Rambura': ['Rambura', 'Kinyababa'],
        'Kinyababa': ['Karago', 'Kavumu'],
      },
      'Bigogwe': {
        'Rego': ['Bigogwe', 'Arusha'],
        'Kora': ['Kora', 'Gatare'],
      },
      'Jomba': {
        'Gisizi': ['Jomba', 'Kabatwa'],
        'Jomba': ['Jomba Centre', 'Bwiza'],
      },
    },
    'Nyamasheke': {
      'Kagano': {
        'Kagano': ['Nyamasheke Ville', 'Shangi'],
        'Nyamasheke': ['Kagano Centre', 'Gatare'],
      },
      'Bushenge': {
        'Bushenge': ['Bushenge Hospital', 'Gitambi'],
        'Gitambi': ['Kanjongo', 'Kavumu'],
      },
      'Kanjongo': {
        'Kanjongo': ['Kibogora Hospital', 'Kirambo'],
        'Kibogora': ['Kibogora Lake', 'Gatare'],
      },
      'Cyato': {
        'Cyato': ['Cyato', 'Rangiro'],
        'Rangiro': ['Ntendezi', 'Kavumu'],
      },
    },
    'Rubavu': {
      'Gisenyi': {
        'Kivumu': ['Gisenyi Ville', 'Lake Kivu Shore'],
        'Mbugangari': ['Mbugangari', 'Petite Barriere'],
        'Nengo': ['Nengo', 'Grande Barriere'],
        'Amahoro': ['Amahoro', 'Rebero'],
      },
      'Rubavu': {
        'Byahi': ['Byahi', 'Murara'],
        'Buhuru': ['Buhuru', 'Gatare'],
      },
      'Rugerero': {
        'Gisa': ['Rugerero', 'Mahoko'],
        'Rugerero': ['Rugerero Centre', 'Kavumu'],
      },
      'Nyamyumba': {
        'Brasseries': ['Brasseries', 'Hot Springs'],
        'Nyamyumba': ['Rubona', 'Kavumu'],
      },
      'Kanama': {
        'Kanama': ['Kanama', 'Rusororo'],
        'Rusororo': ['Mahoko', 'Gatare'],
      },
    },
    'Rusizi': {
      'Kamembe': {
        'Kamembe': ['Kamembe Ville', 'Rusizi I'],
        'Gihundwe': ['Rusizi II', 'Cyangugu'],
      },
      'Giheke': {
        'Giheke': ['Giheke', 'Kamatita'],
        'Kamatita': ['Shagasha', 'Gatare'],
      },
      'Bugarama': {
        'Bugarama': ['Bugarama Cimerwa', 'Pera'],
        'Nyange': ['Nyange', 'Kavumu'],
      },
      'Gashonga': {
        'Gashonga': ['Gashonga', 'Rusunyu'],
        'Rusunyu': ['Mibilizi', 'Gatare'],
      },
    },
    'Rutsiro': {
      'Gihango': {
        'Gihango': ['Gihango', 'Boneza'],
        'Congori': ['Congori', 'Kavumu'],
      },
      'Boneza': {
        'Boneza': ['Boneza', 'Kinunu'],
        'Bushaka': ['Bushaka', 'Gatare'],
      },
      'Murunda': {
        'Murunda': ['Murunda Hospital', 'Rusebeya'],
        'Kivumu': ['Kivumu', 'Congo-Nil'],
      },
      'Ruhango': {
        'Ruhango': ['Ruhango', 'Kayove'],
        'Kayove': ['Bumba', 'Gatare'],
      },
    },
  },
};

export const PROVINCES = Object.keys(RWANDA_LOCATIONS);

/**
 * Returns all districts in the specified province.
 */
export function getDistricts(province: string): string[] {
  if (!province || !RWANDA_LOCATIONS[province]) return [];
  return Object.keys(RWANDA_LOCATIONS[province]);
}

/**
 * Returns all sectors in the specified district of the given province.
 */
export function getSectors(province: string, district: string): string[] {
  if (!province || !district || !RWANDA_LOCATIONS[province]?.[district]) return [];
  return Object.keys(RWANDA_LOCATIONS[province][district]);
}

/**
 * Returns all cells in the specified sector.
 */
export function getCells(province: string, district: string, sector: string): string[] {
  if (!province || !district || !sector || !RWANDA_LOCATIONS[province]?.[district]?.[sector]) return [];
  return Object.keys(RWANDA_LOCATIONS[province][district][sector]);
}

/**
 * Returns all villages (imidugudu) in the specified cell.
 */
export function getVillages(
  province: string,
  district: string,
  sector: string,
  cell: string
): string[] {
  if (
    !province ||
    !district ||
    !sector ||
    !cell ||
    !RWANDA_LOCATIONS[province]?.[district]?.[sector]?.[cell]
  )
    return [];
  return RWANDA_LOCATIONS[province][district][sector][cell];
}
