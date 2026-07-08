import json
from pathlib import Path
from schemas import KnowledgeBase
KNOWLEDGE_BASES_FILE = Path("knowledge_bases.json")
def load_knowledge_bases_from_file() -> list[KnowledgeBase]:
    if not KNOWLEDGE_BASES_FILE.exists():
        return [
            KnowledgeBase(id=1, name="产品文档", document_count=0),
            KnowledgeBase(id=2, name="学习资料", document_count=0),
            KnowledgeBase(id=3, name="面试资料", document_count=0),
        ]

    raw_text = KNOWLEDGE_BASES_FILE.read_text(encoding="utf-8")
    raw_data = json.loads(raw_text)

    loaded_knowledge_bases = []

    for item in raw_data:
        knowledge_base = KnowledgeBase(
            id=item["id"],
            name=item["name"],
            document_count=0,
        )
        loaded_knowledge_bases.append(knowledge_base)

    return loaded_knowledge_bases


def save_knowledge_bases_to_file() -> None:
    data = []

    for kb in knowledge_bases:
        data.append({
            "id": kb.id,
            "name": kb.name,
        })

    KNOWLEDGE_BASES_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


knowledge_bases = load_knowledge_bases_from_file()


def create_knowledge_base(name: str) -> KnowledgeBase:
    new_id = 1

    if knowledge_bases:
        new_id = knowledge_bases[-1].id + 1

    knowledge_base = KnowledgeBase(
        id=new_id,
        name=name,
        document_count=0,
    )

    knowledge_bases.append(knowledge_base)
    save_knowledge_bases_to_file()

    return knowledge_base

def list_knowledge_base() -> list[KnowledgeBase]:
    from services.document_service import document_by_kb

    for kb in knowledge_bases:
        documents = document_by_kb.get(kb.id, [])
        kb.document_count = len(documents)

    return knowledge_bases