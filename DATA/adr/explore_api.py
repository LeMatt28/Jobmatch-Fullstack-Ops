import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("WELOVEDEVS_API_KEY")
url = "https://epi-api.welovedevs.com/v1"

headers = {"X-API-Key": api_key}
params = {"page": 0, "size": 10}

res = requests.get(url, headers=headers, params=params)

if res.status_code == 200:
    data = res.json()
    jobs = data["values"]
    
    liste_triee = []
    
    # On boucle pour ne garder que 3 infos simples par job
    for job in jobs:
        mon_job = {
            "titre": job.get("title"),
            "entreprise": job.get("smallCompany", {}).get("companyName"),
            "technos": job.get("skillsList")
        }
        liste_triee.append(mon_job)
        
    # On sauvegarde dans un fichier json
    with open("jobs_simples.json", "w", encoding="utf-8") as fichier:
        json.dump(liste_triee, fichier, indent=4, ensure_ascii=False)
        
    print(f"Succès : {len(liste_triee)} jobs triés et sauvegardés dans jobs_simples.json")
else:
    print("Erreur:", res.status_code)