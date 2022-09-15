from typing import Iterable

import requests

from lxml.html.soupparser import fromstring
import constants as consts


def g2b_ito_gov() -> Iterable[str]:
    resp = requests.post(consts.g2b_gov_url,
                         allow_redirects=True,
                         verify=False,
                         data="__RequestVerificationToken=anT-gJxRm88BDXiQ9xx58aXWIe6ORnFgkcVUjH8omQCPkB_Sp_IInXGLln0pA2F7BFTrzmL6ZLNuedLsnDTaMTtvSt81&ExportExcel=true&Sort=ApproveDate",
                         headers={
                             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                             'X-Requested-With': 'XMLHttpRequest',
                             'Cookie': '__RequestVerificationToken=l-l78QxaBtMOJaDmvU4o22T759ExIEMvs4JsxAmqLCKzy1yiDiBNUDyO7SAO12xlqenpyzNf5vXzQ7TXLpM3bC_YBz81; ASP.NET_SessionId=t5c2ttxxlctggncpdyh0zvju'
                         })
    resp.raise_for_status()

    tree = fromstring(resp.text)
    return (row.text for row in tree.xpath('//td[1]'))


def adsl_tci() -> Iterable[str]:
    with open(consts.adsl_tci_file_path, "r") as file:
        return (line.strip() for line in file.readlines())


def ads() -> Iterable[str]:
    with open(consts.ad_domains_path, "r") as fp:
        return sorted(fp.read().splitlines())
