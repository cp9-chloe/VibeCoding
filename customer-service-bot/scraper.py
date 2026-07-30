import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re
import time


def is_same_domain(url, base_domain):
    return base_domain in urlparse(url).netloc


def clean_text(text):
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_text_from_url(url):
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ")
        return clean_text(text)
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ""


def discover_links(start_url, max_pages=20):
    visited = set()
    to_visit = [start_url]
    base_domain = urlparse(start_url).netloc

    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url in visited:
            continue
        visited.add(url)
        try:
            resp = requests.get(url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            for a in soup.find_all("a", href=True):
                href = urljoin(url, a["href"])
                parsed = urlparse(href)
                if parsed.scheme in ("http", "https") and is_same_domain(href, base_domain):
                    clean_href = parsed._replace(fragment="").geturl()
                    if clean_href not in visited and clean_href not in to_visit:
                        to_visit.append(clean_href)
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to discover from {url}: {e}")
    return list(visited)
