import PersonSearchIcon from "@mui/icons-material/PersonSearch";
export default async function UserDetailPage() {
  return <EmptyUserSelection />;
}

function EmptyUserSelection() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <div className="mb-4">
        <PersonSearchIcon className="text-6xl opacity-50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">사용자를 선택해주세요</h3>
      <p className="text-sm text-center max-w-sm">
        왼쪽 목록에서 사용자를 선택하면 해당 사용자의 상세 정보와 스케줄을
        확인할 수 있습니다.
      </p>
      <div className="mt-6 text-xs text-gray-400">
        💡 검색을 통해 특정 사용자를 빠르게 찾을 수 있습니다
      </div>
    </div>
  );
}
